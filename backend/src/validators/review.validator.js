import { body, param, query } from "express-validator";

export const submitReviewValidator = [
  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isEmpty()
    .withMessage("Invalid submission"),
  body("product").isMongoId().withMessage("Valid product id is required"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Title cannot exceed 120 characters"),
  body("comment")
    .trim()
    .isLength({ min: 10, max: 1500 })
    .withMessage("Comment must be between 10 and 1500 characters")
];

export const productReviewsValidator = [
  param("productId").isMongoId().withMessage("Valid product id is required"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer")
];

export const featuredReviewsValidator = [
  query("limit").optional().isInt({ min: 1, max: 20 }).withMessage("Limit must be between 1 and 20")
];

export const adminReviewListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "hidden", "spam"])
    .withMessage("Invalid review status"),
  query("product")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Valid product id is required"),
  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),
  query("search").optional().trim()
];

export const reviewIdValidator = [
  param("id").isMongoId().withMessage("Valid review id is required")
];

export const rejectReviewValidator = [
  ...reviewIdValidator,
  body("rejectionReason")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Rejection reason cannot exceed 500 characters")
];
