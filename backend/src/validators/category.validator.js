import { body, param } from "express-validator";

export const categoryIdParamValidator = [
  param("id").isMongoId().withMessage("Valid category id is required")
];

export const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];

export const updateCategoryValidator = [
  ...categoryIdParamValidator,
  body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];
