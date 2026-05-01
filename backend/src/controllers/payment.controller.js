import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import verifyRazorpaySignature from "../utils/verifyRazorpaySignature.js";
import env from "../config/env.js";
import { runMongoTransaction } from "../utils/mongoTransactions.js";

const getQueryOptions = (session = null) => (session ? { session } : {});

const ensureOrderCanBeVerified = ({ order, userId, razorpayOrderId }) => {
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to verify this payment");
  }

  if (order.paymentDetails.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, "Razorpay order id does not match");
  }
};

const rollbackStockAdjustments = async (stockAdjustments) => {
  if (!stockAdjustments.length) {
    return;
  }

  await Product.bulkWrite(
    stockAdjustments.map((adjustment) => ({
      updateOne: {
        filter: { _id: adjustment.productId },
        update: {
          $inc: { stock: adjustment.quantity, soldCount: -adjustment.quantity },
          $set: { inStock: true }
        }
      }
    }))
  );
};

const rollbackPaidOrderState = async (orderId) => {
  await Order.findByIdAndUpdate(orderId, {
    $set: {
      paymentStatus: "pending",
      orderStatus: "created",
      paidAt: null,
      "paymentDetails.razorpayPaymentId": "",
      "paymentDetails.razorpaySignature": "",
      "paymentDetails.verifiedAt": null
    }
  });
};

const applySuccessfulPayment = async ({
  order,
  userId,
  razorpay_payment_id,
  razorpay_signature,
  session = null
}) => {
  if (order.paymentStatus === "paid") {
    return { order, alreadyPaid: true };
  }

  const queryOptions = getQueryOptions(session);
  const existingPayment = await Order.findOne({
    _id: { $ne: order._id },
    "paymentDetails.razorpayPaymentId": razorpay_payment_id
  }, null, queryOptions);

  if (existingPayment) {
    throw new ApiError(409, "This Razorpay payment has already been used for another order");
  }

  const stockAdjustments = [];
  let orderMarkedPaid = false;
  let stockRolledBack = false;

  try {
    for (const item of order.items) {
      const product = session
        ? await Product.findById(item.product).session(session)
        : await Product.findById(item.product);

      if (!product) {
        throw new ApiError(404, `${item.name} no longer exists`);
      }

      if (product.status !== "active" || product.isDeleted) {
        throw new ApiError(400, `${item.name} is no longer available`);
      }

      if (product.stock <= 0) {
        throw new ApiError(400, `${item.name} is out of stock`);
      }

      if (Number(item.quantity) > Number(product.stock)) {
        throw new ApiError(400, `Only ${product.stock} item(s) available for ${item.name}`);
      }

      product.stock = Number(product.stock) - Number(item.quantity);
      product.soldCount = Number(product.soldCount || 0) + Number(item.quantity);
      product.inStock = product.stock > 0;
      await product.save(queryOptions);

      stockAdjustments.push({
        productId: item.product,
        quantity: item.quantity
      });
    }

    const paidAt = new Date();
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        paymentStatus: { $ne: "paid" }
      },
      {
        $set: {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          paidAt,
          "paymentDetails.razorpayPaymentId": razorpay_payment_id,
          "paymentDetails.razorpaySignature": razorpay_signature,
          "paymentDetails.verifiedAt": paidAt
        }
      },
      {
        new: true,
        ...queryOptions
      }
    );

    if (!updatedOrder) {
      if (!session) {
        await rollbackStockAdjustments(stockAdjustments);
        stockRolledBack = true;
      }

      const latestOrder = await Order.findById(order._id, null, queryOptions);
      if (latestOrder?.paymentStatus === "paid") {
        return { order: latestOrder, alreadyPaid: true };
      }

      throw new ApiError(409, "Order payment status changed during verification");
    }

    orderMarkedPaid = true;

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      queryOptions
    );

    return { order: updatedOrder, alreadyPaid: false };
  } catch (error) {
    if (!session) {
      if (orderMarkedPaid) {
        await rollbackPaidOrderState(order._id);
      }

      if (!stockRolledBack) {
        await rollbackStockAdjustments(stockAdjustments);
      }
    }

    throw error;
  }
};

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!env.razorpayKeySecret && !env.razorpayMockMode) {
    throw new ApiError(500, "Razorpay secret is not configured");
  }

  const isMockPayment =
    env.razorpayMockMode &&
    razorpay_order_id.startsWith("mock_order_") &&
    razorpay_payment_id.startsWith("mock_payment_") &&
    razorpay_signature === "mock_signature";

  const isValidSignature = isMockPayment
    ? true
    : verifyRazorpaySignature({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        secret: env.razorpayKeySecret
      });

  if (!isValidSignature) {
    throw new ApiError(400, "Invalid Razorpay payment signature");
  }

  const { result } = await runMongoTransaction(async ({ session }) => {
    const order = session
      ? await Order.findById(orderId).session(session)
      : await Order.findById(orderId);

    ensureOrderCanBeVerified({
      order,
      userId: req.user._id,
      razorpayOrderId: razorpay_order_id
    });

    return applySuccessfulPayment({
      order,
      userId: req.user._id,
      razorpay_payment_id,
      razorpay_signature,
      session
    });
  });

  res.status(200).json({
    success: true,
    message: result.alreadyPaid
      ? "Payment already verified"
      : "Payment verified successfully",
    data: result.order
  });
});
