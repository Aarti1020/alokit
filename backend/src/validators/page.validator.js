import { body, param } from "express-validator";

const pageTypes = [
  "custom",
  "about",
  "contact",
  "privacy-policy",
  "terms",
  "shipping-policy",
  "refund-policy",
  "faq-page"
];
const pageStatuses = ["draft", "published"];

const seoValidator = [
  body("seo").optional().isObject().withMessage("SEO must be an object"),
  body("seo.metaTitle")
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("SEO metaTitle must be at most 120 characters"),
  body("seo.metaDescription")
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("SEO metaDescription must be at most 320 characters"),
  body("seo.metaKeywords").optional().isArray().withMessage("SEO metaKeywords must be an array"),
  body("seo.metaKeywords.*").optional().isString().withMessage("Each SEO meta keyword must be a string"),
  body("seo.ogTitle")
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("SEO ogTitle must be at most 120 characters"),
  body("seo.ogDescription")
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("SEO ogDescription must be at most 320 characters"),
  body("seo.ogImage").optional().isString().withMessage("SEO ogImage must be a string"),
  body("seo.canonicalUrl")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("SEO canonicalUrl must be at most 500 characters"),
  body("seo.robots")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("SEO robots must be at most 100 characters")
];

export const pageIdParamValidator = [
  param("id").isMongoId().withMessage("Valid page id is required")
];

export const pageSlugParamValidator = [
  param("slug").trim().notEmpty().withMessage("Page slug is required")
];

const basePageValidator = [
  body("title").optional().trim().notEmpty().withMessage("Page title is required"),
  body("slug").optional().trim().notEmpty().withMessage("Page slug cannot be empty"),
  body("pageType").optional().isIn(pageTypes).withMessage("Invalid page type"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("status").optional().isIn(pageStatuses).withMessage("Invalid page status"),
  body("showInHeader").optional().isBoolean().withMessage("showInHeader must be a boolean"),
  body("showInFooter").optional().isBoolean().withMessage("showInFooter must be a boolean"),
  ...seoValidator
];

export const createPageValidator = [
  body("title").trim().notEmpty().withMessage("Page title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  ...basePageValidator
];

export const updatePageValidator = [
  ...pageIdParamValidator,
  ...basePageValidator
];
