import express from "express";
import protect from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { verifyPayment } from "../controllers/payment.controller.js";
import { verifyPaymentValidator } from "../validators/payment.validator.js";

const router = express.Router();

router.use(protect);

router.post("/verify", verifyPaymentValidator, validate, verifyPayment);

export default router;
