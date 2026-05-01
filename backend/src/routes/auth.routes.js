import express from "express";
import {
  forgotPassword,
  getMe,
  loginUser,
  registerUser,
  resetPassword
} from "../controllers/auth.controller.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator
} from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidator, validate, resetPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.get("/me", protect, getMe);

export default router;
