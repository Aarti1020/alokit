import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import cloudinaryDelete from "../utils/cloudinaryDelete.js";

const buildUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar || { public_id: "", url: "" },
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const normalizeRole = (role) => (role === "super_admin" ? "superAdmin" : role);

export const getAdminUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.role) {
    filter.role = normalizeRole(req.query.role);
  }

  if (req.query.status === "active") {
    filter.isActive = true;
  }

  if (req.query.status === "inactive") {
    filter.isActive = false;
  }

  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { phone: { $regex: req.query.search, $options: "i" } }
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password -resetPasswordToken -resetPasswordExpiresAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Admin users fetched successfully",
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    data: users.map(buildUserResponse)
  });
});

export const getAdminUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpiresAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "Admin user fetched successfully",
    data: buildUserResponse(user)
  });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, role, isActive } = req.body;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    phone,
    role: normalizeRole(role || "user"),
    isActive: isActive ?? true
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: buildUserResponse(user)
  });
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, role, isActive } = req.body;
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpiresAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isSelf = user._id.toString() === req.user._id.toString();

  if (email && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email");
    }
    user.email = email.toLowerCase();
  }

  if (isSelf && role !== undefined && normalizeRole(role) !== user.role) {
    throw new ApiError(400, "You cannot change your own role");
  }

  if (isSelf && isActive === false) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = normalizeRole(role);
  if (isActive !== undefined) user.isActive = isActive;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: buildUserResponse(user)
  });
});

export const resetAdminUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User password reset successfully",
    data: buildUserResponse(user)
  });
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findById(req.params.id).select("_id avatar");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const linkedOrders = await Order.countDocuments({ user: user._id });
  if (linkedOrders > 0) {
    throw new ApiError(400, "Cannot delete user because orders are linked to this account");
  }

  if (user.avatar?.public_id) {
    await cloudinaryDelete([user.avatar.public_id]);
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: null
  });
});

const updateUserBlockedState = async (req, res, isActive) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpiresAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own active status");
  }

  user.isActive = isActive;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: isActive ? "User unblocked successfully" : "User blocked successfully",
    data: buildUserResponse(user)
  });
};

export const blockAdminUser = asyncHandler(async (req, res) =>
  updateUserBlockedState(req, res, false)
);

export const unblockAdminUser = asyncHandler(async (req, res) =>
  updateUserBlockedState(req, res, true)
);

export const getAdminUserOrders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("_id");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const orders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name slug sku thumbnail");

  res.status(200).json({
    success: true,
    message: "User orders fetched successfully",
    results: orders.length,
    data: orders
  });
});
