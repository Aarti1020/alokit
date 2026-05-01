import { body, param, query } from "express-validator";

const faqModules = [
  "general",
  "product",
  "order",
  "shipping",
  "refund",
  "rudraksha",
  "gemstone",
  "homepage",
  "collection"
];
const faqStatuses = ["active", "inactive"];

export const faqIdParamValidator = [
  param("id").isMongoId().withMessage("Valid FAQ id is required")
];

export const publicFaqListValidator = [
  query("module").optional().isIn(faqModules).withMessage("Invalid FAQ module"),
  query("category").optional().trim(),
  query("entityId").optional().isMongoId().withMessage("Valid entity id is required")
];

const baseFaqValidator = [
  body("question").optional().trim().notEmpty().withMessage("Question is required"),
  body("answer").optional().trim().notEmpty().withMessage("Answer is required"),
  body("category").optional().trim(),
  body("module").optional().isIn(faqModules).withMessage("Invalid FAQ module"),
  body("entityId").optional({ values: "falsy" }).isMongoId().withMessage("Valid entity id is required"),
  body("status").optional().isIn(faqStatuses).withMessage("Invalid FAQ status"),
  body("sortOrder").optional().isInt().withMessage("sortOrder must be an integer"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean")
];

export const createFaqValidator = [
  body("question").trim().notEmpty().withMessage("Question is required"),
  body("answer").trim().notEmpty().withMessage("Answer is required"),
  ...baseFaqValidator
];

export const updateFaqValidator = [
  ...faqIdParamValidator,
  ...baseFaqValidator
];
