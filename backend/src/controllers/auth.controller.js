import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";
import env from "../config/env.js";
import { getEmailService } from "../services/email.service.js";

const buildAuthResponse = (user) => ({
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

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

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
    role: "user"
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: buildAuthResponse(user),
      token
    }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is blocked or inactive");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: buildAuthResponse(user),
      token
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!["admin", "superAdmin"].includes(user.role)) {
    throw new ApiError(403, "Admin access is required");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is blocked or inactive");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: {
      user: buildAuthResponse(user),
      token
    }
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const normalizedEmail = req.body.email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+resetPasswordToken +resetPasswordExpiresAt"
  );

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
      data: null
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = new URL(env.passwordResetPath, env.clientUrl).toString();
  const resetUrlWithToken = `${resetUrl}${resetUrl.includes("?") ? "&" : "?"}token=${resetToken}`;

  try {
    const emailService = getEmailService();
    const delivery = await emailService.sendForgotPasswordEmail({
      to: user.email,
      fullName: user.fullName,
      resetUrl: resetUrlWithToken,
      expiresInMinutes: env.passwordResetExpiresInMinutes,
      resetToken
    });

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
      data:
        delivery.preview && env.emailDevExposeResetToken
          ? {
              emailMode: env.emailMode,
              preview: delivery.preview,
              expiresInMinutes: env.passwordResetExpiresInMinutes
            }
          : null
    });
  } catch (error) {
    user.resetPasswordToken = "";
    user.resetPasswordExpiresAt = null;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(503, "Unable to send reset email right now. Please try again shortly.");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.token || req.body.token;
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: new Date() }
  }).select("+resetPasswordToken +resetPasswordExpiresAt");

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = "";
  user.resetPasswordExpiresAt = null;
  await user.save();

  try {
    const emailService = getEmailService();
    await emailService.sendPasswordResetConfirmationEmail({
      to: user.email,
      fullName: user.fullName
    });
  } catch (error) {
    console.error("[email] Password reset confirmation email failed", {
      userId: String(user._id),
      error: {
        name: error?.name || "Error",
        message: error?.message || "Unknown email error",
        code: error?.code || "UNKNOWN"
      }
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    data: {
      user: buildAuthResponse(user),
      token
    }
  });
});
