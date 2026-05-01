import { body, param, query } from "express-validator";

export const createLeadValidator = [
  body("website").optional().trim(),
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .optional({ values: "falsy" })
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
  body("formType")
    .optional()
    .isIn([
      "contact",
      "consultation",
      "custom_order",
      "bulk_order",
      "callback",
      "gemstone_recommendation",
      "rudraksha_recommendation"
    ])
    .withMessage("Invalid form type"),
  body("source").optional().trim(),
  body("product")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Valid product id is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority")
];

export const leadListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
  query("status")
    .optional()
    .isIn(["new", "contacted", "qualified", "converted", "closed", "spam"])
    .withMessage("Invalid status"),
  query("formType")
    .optional()
    .isIn([
      "contact",
      "consultation",
      "custom_order",
      "bulk_order",
      "callback",
      "gemstone_recommendation",
      "rudraksha_recommendation"
    ])
    .withMessage("Invalid form type"),
  query("source").optional().trim(),
  query("isSpam").optional().isBoolean().withMessage("isSpam must be true or false"),
  query("search").optional().trim()
];

export const leadIdValidator = [
  param("id").isMongoId().withMessage("Valid lead id is required")
];

export const updateLeadStatusValidator = [
  ...leadIdValidator,
  body("status")
    .isIn(["new", "contacted", "qualified", "converted", "closed", "spam"])
    .withMessage("Invalid lead status")
];

export const addLeadNoteValidator = [
  ...leadIdValidator,
  body("note")
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage("Note must be between 2 and 500 characters")
];
