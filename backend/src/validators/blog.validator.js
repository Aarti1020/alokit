import { body, param, query } from "express-validator";

const blogStatuses = ["draft", "published"];

const seoValidator = (prefix = "seo") => [
  body(prefix).optional().isObject().withMessage("SEO must be an object"),
  body(`${prefix}.metaTitle`)
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("SEO metaTitle must be at most 120 characters"),
  body(`${prefix}.metaDescription`)
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("SEO metaDescription must be at most 320 characters"),
  body(`${prefix}.metaKeywords`)
    .optional()
    .isArray()
    .withMessage("SEO metaKeywords must be an array"),
  body(`${prefix}.metaKeywords.*`)
    .optional()
    .isString()
    .withMessage("Each SEO meta keyword must be a string"),
  body(`${prefix}.ogTitle`)
    .optional()
    .isString()
    .isLength({ max: 120 })
    .withMessage("SEO ogTitle must be at most 120 characters"),
  body(`${prefix}.ogDescription`)
    .optional()
    .isString()
    .isLength({ max: 320 })
    .withMessage("SEO ogDescription must be at most 320 characters"),
  body(`${prefix}.ogImage`).optional().isString().withMessage("SEO ogImage must be a string"),
  body(`${prefix}.canonicalUrl`)
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("SEO canonicalUrl must be at most 500 characters"),
  body(`${prefix}.robots`)
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("SEO robots must be at most 100 characters")
];

export const blogIdParamValidator = [
  param("id").isMongoId().withMessage("Valid blog id is required")
];

export const blogSlugParamValidator = [
  param("slug").trim().notEmpty().withMessage("Blog slug is required")
];

export const publicBlogListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("search").optional().trim(),
  query("category").optional().trim(),
  query("tag").optional().trim(),
  query("featured").optional().isBoolean().withMessage("featured must be a boolean")
];

const baseBlogValidator = [
  body("title").optional().trim().notEmpty().withMessage("Blog title is required"),
  body("slug").optional().trim().notEmpty().withMessage("Blog slug cannot be empty"),
  body("excerpt").optional().trim(),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("featuredImage").optional().trim(),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").optional().isString().withMessage("Each image must be a string"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),
  body("category").optional().trim(),
  body("authorName").optional().trim(),
  body("status").optional().isIn(blogStatuses).withMessage("Invalid blog status"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
  body("publishedAt").optional().isISO8601().withMessage("publishedAt must be a valid date"),
  ...seoValidator()
];

export const createBlogValidator = [
  body("title").trim().notEmpty().withMessage("Blog title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  ...baseBlogValidator
];

export const updateBlogValidator = [
  ...blogIdParamValidator,
  ...baseBlogValidator
];
