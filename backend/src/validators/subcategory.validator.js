import { body, param } from "express-validator";

export const subCategoryIdParamValidator = [
  param("id").isMongoId().withMessage("Valid subcategory id is required")
];

export const createSubCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Subcategory name is required"),
  body("category").isMongoId().withMessage("Valid category id is required"),
  body("description").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];

export const updateSubCategoryValidator = [
  ...subCategoryIdParamValidator,
  body("name").optional().trim().notEmpty().withMessage("Subcategory name cannot be empty"),
  body("category").optional().isMongoId().withMessage("Valid category id is required"),
  body("description").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];
