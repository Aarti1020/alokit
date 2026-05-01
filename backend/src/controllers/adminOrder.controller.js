import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const populateAdminOrder = (orderId) =>
  Order.findById(orderId)
    .populate("user", "fullName email phone role isActive")
    .populate("items.product", "name slug sku thumbnail");

export const getAdminOrders = asyncHandler(async (req, res) => {
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
    .populate("user", "fullName email phone role isActive");

  res.status(200).json({
    success: true,
    message: "Admin orders fetched successfully",
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    data: orders
  });
});

export const getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await populateAdminOrder(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Admin order fetched successfully",
    data: order
  });
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.orderStatus = req.body.orderStatus;
  await order.save();

  const updatedOrder = await populateAdminOrder(order._id);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder
  });
});

export const updateAdminPaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = req.body.paymentStatus;
  await order.save();

  const updatedOrder = await populateAdminOrder(order._id);

  res.status(200).json({
    success: true,
    message: "Order payment status updated successfully",
    data: updatedOrder
  });
});
