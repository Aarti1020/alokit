import { body } from "express-validator";

export const submitContactValidator = [
  body("website").optional().trim(),
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
  body("source").optional().trim(),
  body("product")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Valid product id is required")
];
