import { body } from "express-validator";

export const verifyPaymentValidator = [
  body("orderId").isMongoId().withMessage("Valid order id is required"),
  body("razorpay_order_id").trim().notEmpty().withMessage("razorpay_order_id is required"),
  body("razorpay_payment_id").trim().notEmpty().withMessage("razorpay_payment_id is required"),
  body("razorpay_signature").trim().notEmpty().withMessage("razorpay_signature is required")
];
