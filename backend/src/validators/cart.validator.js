import { body, param } from "express-validator";

export const addToCartValidator = [
  body("productId").isMongoId().withMessage("Valid product id is required"),
  body("selectedVariant").optional().isObject().withMessage("selectedVariant must be an object"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
];

export const updateCartItemValidator = [
  param("itemId").isMongoId().withMessage("Valid cart item id is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer")
];

export const removeCartItemValidator = [
  param("productId").isMongoId().withMessage("Valid product id is required")
];
