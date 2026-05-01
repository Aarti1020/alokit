import { body } from "express-validator";

export const registerValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").optional().trim(),
  body("role")
    .not()
    .exists()
    .withMessage("Role cannot be set from the public register route")
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required")
];

export const resetPasswordValidator = [
  body("token").optional().trim(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password must match password")
    .custom((value, { req }) => {
      if (!req.body.token && !req.params.token) {
        throw new Error("Reset token is required");
      }

      return true;
    })
];
