import { body, param } from "express-validator";

export const userIdParamValidator = [
  param("id").isMongoId().withMessage("Valid user id is required")
];

const validRoles = ["user", "admin", "superAdmin", "super_admin"];

export const createAdminUserValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").optional().trim(),
  body("role")
    .optional()
    .isIn(validRoles)
    .withMessage("Role must be user, admin, or superAdmin"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];

export const updateAdminUserValidator = [
  ...userIdParamValidator,
  body("fullName").optional().trim().notEmpty().withMessage("Full name cannot be empty"),
  body("email").optional().trim().isEmail().withMessage("Valid email is required"),
  body("phone").optional().trim(),
  body("role")
    .optional()
    .isIn(validRoles)
    .withMessage("Role must be user, admin, or superAdmin"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];

export const resetAdminUserPasswordValidator = [
  ...userIdParamValidator,
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password must match password")
];
