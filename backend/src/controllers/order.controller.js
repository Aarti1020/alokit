import Razorpay from "razorpay";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import generateOrderNumber from "../utils/generateOrderNumber.js";
import env from "../config/env.js";

const razorpay = env.hasRazorpayCredentials
  ? new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret
    })
  : null;

const getPublishedProductsForCart = async (cart) => {
  const productIds = cart.items.map((item) => item.productId || item.product);

  return Product.find({
    _id: { $in: productIds }
  })
    .populate("category", "name")
    .populate("subCategory", "name category");
};

const ensureOrderItemProductIsAvailable = (product, quantity, itemName = "Product") => {
  if (!product) {
    throw new ApiError(404, `${itemName} no longer exists`);
  }

  if (product.status !== "active" || product.isDeleted) {
    throw new ApiError(400, `${product.title || product.name} is no longer available`);
  }

  if (product.stock <= 0) {
    throw new ApiError(400, `${product.title || product.name} is out of stock`);
  }

  if (Number(quantity) > Number(product.stock)) {
    throw new ApiError(
      400,
      `Only ${product.stock} item(s) available for ${product.title || product.name}`
    );
  }
};

const buildOrderItems = (cartItems, products) => {
  const { items, pricing } = calculateCartTotals(cartItems, products);

  const orderItems = items.map((item) => {
    const product = products.find(
      (productDoc) => productDoc._id.toString() === item.product.toString()
    );

    if (!product) {
      throw new ApiError(404, "One or more cart products are no longer available");
    }
    ensureOrderItemProductIsAvailable(product, item.quantity, item.productName || item.name);

    return {
      product: product._id,
      productId: item.productId || product._id,
      productName: item.productName || product.title || product.name,
      productSlug: item.productSlug || product.slug,
      featuredImage:
        item.featuredImage || product.featuredImage || product.thumbnail || "",
      selectedVariant: item.selectedVariant || null,
      name: item.productName || product.title || product.name,
      slug: item.productSlug || product.slug,
      sku: product.sku,
      thumbnail: item.featuredImage || product.featuredImage || product.thumbnail || "",
      productType: product.productType,
      category: product.category?._id || product.category,
      categoryName: product.category?.name || "",
      subCategory: product.subCategory?._id || product.subCategory,
      subCategoryName: product.subCategory?.name || "",
      origin: product.origin,
      shape: product.shape,
      style: product.style,
      weightCarat: product.weightCarat,
      weightRatti: product.weightRatti,
      certificationLab: product.certificationLab,
      treatment: product.treatment,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      finalPrice: item.finalPrice,
      lineTotal: item.lineTotal
    };
  });

  return { orderItems, pricing };
};

const createRazorpayOrder = async (order) => {
  if (env.razorpayMockMode) {
    return {
      id: `mock_order_${order._id.toString()}`,
      currency: "INR",
      amount: Math.round(order.pricing.total * 100),
      receipt: order.orderNumber,
      status: "created",
      isMock: true
    };
  }

  if (!razorpay) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }

  try {
    return await razorpay.orders.create({
      amount: Math.round(order.pricing.total * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        internalOrderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to create Razorpay order");
  }
};

const populateOrder = (orderId) =>
  Order.findById(orderId)
    .populate("user", "fullName email role")
    .populate("items.product", "name slug sku thumbnail");

export const checkout = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const products = await getPublishedProductsForCart(cart);

  if (products.length !== cart.items.length) {
    throw new ApiError(400, "Some cart products are unavailable for checkout");
  }

  const { orderItems, pricing } = buildOrderItems(cart.items, products);

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: orderItems,
    pricing,
    shippingAddress: req.body.shippingAddress,
    billingAddress: req.body.billingAddress,
    notes: req.body.notes || "",
    paymentMethod: req.body.paymentMethod || "razorpay",
    orderStatus: "created",
    paymentStatus: "pending",
    placedAt: new Date()
  });

  try {
    const razorpayOrder = await createRazorpayOrder(order);

    order.paymentDetails.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      message: "Checkout created successfully",
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: order.pricing.total,
        currency: razorpayOrder.currency,
        razorpayKeyId: env.razorpayMockMode ? "mock_key_id" : env.razorpayKeyId,
        razorpayOrderId: razorpayOrder.id,
        paymentGatewayMode: env.razorpayMockMode ? "mock" : "live",
        pricing: order.pricing,
        items: order.items
      }
    });
  } catch (error) {
    await Order.findByIdAndDelete(order._id);
    throw error;
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name slug sku thumbnail");

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    results: orders.length,
    page: 1,
    limit: orders.length,
    totalPages: 1,
    total: orders.length,
    data: orders
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await populateOrder(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = ["admin", "superAdmin"].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not allowed to access this order");
  }

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.orderStatus) {
    filter.orderStatus = req.query.orderStatus;
  }

  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "fullName email role");

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    results: orders.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: orders
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = req.body.orderStatus;
  await order.save();

  const updatedOrder = await populateOrder(order._id);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder
  });
});
