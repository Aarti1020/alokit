import { body, param, query } from "express-validator";

const addressValidator = (fieldName) => [
  body(`${fieldName}.fullName`).trim().notEmpty().withMessage(`${fieldName}.fullName is required`),
  body(`${fieldName}.email`).trim().isEmail().withMessage(`${fieldName}.email must be valid`),
  body(`${fieldName}.phone`).trim().notEmpty().withMessage(`${fieldName}.phone is required`),
  body(`${fieldName}.addressLine1`)
    .trim()
    .notEmpty()
    .withMessage(`${fieldName}.addressLine1 is required`),
  body(`${fieldName}.addressLine2`).optional().trim(),
  body(`${fieldName}.city`).trim().notEmpty().withMessage(`${fieldName}.city is required`),
  body(`${fieldName}.state`).trim().notEmpty().withMessage(`${fieldName}.state is required`),
  body(`${fieldName}.postalCode`)
    .trim()
    .notEmpty()
    .withMessage(`${fieldName}.postalCode is required`),
  body(`${fieldName}.country`).trim().notEmpty().withMessage(`${fieldName}.country is required`)
];

export const checkoutValidator = [
  ...addressValidator("shippingAddress"),
  ...addressValidator("billingAddress"),
  body("paymentMethod")
    .optional()
    .isIn(["razorpay"])
    .withMessage("Only razorpay payment method is supported"),
  body("notes").optional().trim()
];

export const orderIdParamValidator = [
  param("id").isMongoId().withMessage("Valid order id is required")
];

export const adminOrderListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded", "partially_refunded"])
    .withMessage("Invalid payment status"),
  query("orderStatus")
    .optional()
    .isIn(["created", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status")
];

export const updateOrderStatusValidator = [
  ...orderIdParamValidator,
  body("orderStatus")
    .isIn(["created", "pending", "confirmed", "packed", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status")
];

export const updatePaymentStatusValidator = [
  ...orderIdParamValidator,
  body("paymentStatus")
    .isIn(["pending", "paid", "failed", "refunded", "partially_refunded"])
    .withMessage("Invalid payment status")
];
