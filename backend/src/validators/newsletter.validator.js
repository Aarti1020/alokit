import { body } from "express-validator";

export const subscribeNewsletterValidator = [
  body("website").optional().trim(),
  body("email").trim().isEmail().withMessage("Please provide a valid email"),
  body("name").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("Name cannot exceed 80 characters"),
  body("source").optional({ values: "falsy" }).trim().isLength({ max: 100 }).withMessage("Source cannot exceed 100 characters")
];
