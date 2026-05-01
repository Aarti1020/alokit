import { body } from "express-validator";

export const adminLoginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const updateAdminProfileValidator = [
  body("fullName").optional().trim().notEmpty().withMessage("Full name cannot be empty"),
  body("phone").optional().trim(),
  body("email").optional().trim().isEmail().withMessage("Valid email is required")
];

export const changeAdminPasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Confirm password must match new password")
];
