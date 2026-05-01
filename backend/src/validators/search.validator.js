import { query } from "express-validator";

export const globalSearchValidator = [
  query("q").trim().notEmpty().withMessage("Search query is required"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50")
];

export const searchSuggestionsValidator = [
  query("q").trim().isLength({ min: 1 }).withMessage("Search query is required"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("limit must be between 1 and 20")
];
