import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";
import cloudinaryDelete from "../utils/cloudinaryDelete.js";
import { getDashboardAnalytics } from "../services/admin.service.js";

const buildAdminProfileResponse = (user) => ({
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

export const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    data: buildAdminProfileResponse(req.user)
  });
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id);

  if (!admin) {
    throw new ApiError(404, "Admin user not found");
  }

  if (req.body.email && req.body.email.toLowerCase() !== admin.email) {
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, "Email is already in use");
    }

    admin.email = req.body.email.toLowerCase();
  }

  if (req.body.fullName !== undefined) {
    admin.fullName = req.body.fullName;
  }

  if (req.body.phone !== undefined) {
    admin.phone = req.body.phone;
  }

  await admin.save();

  res.status(200).json({
    success: true,
    message: "Admin profile updated successfully",
    data: buildAdminProfileResponse(admin)
  });
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id).select("+password");

  if (!admin) {
    throw new ApiError(404, "Admin user not found");
  }

  const isMatch = await admin.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  admin.password = req.body.newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
});

export const updateAdminAvatar = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id);

  if (!admin) {
    throw new ApiError(404, "Admin user not found");
  }

  if (!req.file) {
    throw new ApiError(400, "Avatar image is required");
  }

  const uploadedAvatar = await cloudinaryUpload(req.file, {
    folder: "alokit/admin-avatars",
    fileName: admin.fullName || admin.email || "admin-avatar",
    requireCloudinary: true
  });

  if (admin.avatar?.public_id) {
    await cloudinaryDelete([admin.avatar.public_id]);
  }

  admin.avatar = {
    public_id: uploadedAvatar.publicId || uploadedAvatar.public_id,
    url: uploadedAvatar.url || uploadedAvatar.secure_url
  };
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: {
      avatar: admin.avatar
    }
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const analytics = await getDashboardAnalytics();

  res.status(200).json({
    success: true,
    message: "Dashboard analytics fetched successfully",
    data: analytics
  });
});
