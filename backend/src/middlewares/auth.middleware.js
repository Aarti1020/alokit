import jwt from "jsonwebtoken";
import User from "../models/User.js";
import env from "../config/env.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized. Token is missing.");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "User no longer exists or is inactive.");
  }

  req.user = user;
  next();
});

export default protect;
