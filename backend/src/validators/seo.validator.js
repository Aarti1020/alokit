import { body, param } from "express-validator";

const pageKeys = [
  "homepage",
  "blog-listing",
  "product-listing",
  "category-listing",
  "contact-page",
  "about-page"
];

export const seoIdParamValidator = [
  param("id").isMongoId().withMessage("Valid SEO config id is required")
];

export const seoPageKeyParamValidator = [
  param("pageKey").isIn(pageKeys).withMessage("Invalid SEO pageKey")
];

const baseSeoValidator = [
  body("pageKey").optional().isIn(pageKeys).withMessage("Invalid SEO pageKey"),
  body("metaTitle")
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("metaTitle must be at most 120 characters"),
  body("metaDescription")
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("metaDescription must be at most 320 characters"),
  body("metaKeywords").optional().isArray().withMessage("metaKeywords must be an array"),
  body("metaKeywords.*").optional().isString().withMessage("Each meta keyword must be a string"),
  body("ogTitle")
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("ogTitle must be at most 120 characters"),
  body("ogDescription")
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("ogDescription must be at most 320 characters"),
  body("ogImage").optional().isString().withMessage("ogImage must be a string"),
  body("canonicalUrl")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("canonicalUrl must be at most 500 characters"),
  body("robots")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("robots must be at most 100 characters")
];

export const createSeoValidator = [
  body("pageKey").isIn(pageKeys).withMessage("Invalid SEO pageKey"),
  ...baseSeoValidator
];

export const updateSeoValidator = [
  ...seoIdParamValidator,
  ...baseSeoValidator
];
