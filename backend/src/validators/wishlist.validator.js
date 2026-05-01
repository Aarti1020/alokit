import { body, param } from "express-validator";

export const addToWishlistValidator = [
  body("productId").isMongoId().withMessage("Valid product id is required")
];

export const removeFromWishlistValidator = [
  param("productId").isMongoId().withMessage("Valid product id is required")
];
