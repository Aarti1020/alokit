import { body, param, query } from "express-validator";

const productTypes = ["gemstone", "rudraksha", "bracelet", "jewellery", "crystal", ""];
const statuses = ["draft", "published"];

const seoValidator = [
  body("seo").optional().isObject().withMessage("seo must be an object"),
  body("seo.metaTitle").optional().isString().isLength({ max: 120 }).withMessage("SEO metaTitle must be at most 120 characters"),
  body("seo.metaDescription").optional().isString().isLength({ max: 320 }).withMessage("SEO metaDescription must be at most 320 characters"),
  body("seo.metaKeywords").optional().isArray().withMessage("SEO metaKeywords must be an array"),
  body("seo.metaKeywords.*").optional().isString().withMessage("Each SEO keyword must be a string"),
  body("seo.ogTitle").optional().isString().isLength({ max: 120 }).withMessage("SEO ogTitle must be at most 120 characters"),
  body("seo.ogDescription").optional().isString().isLength({ max: 320 }).withMessage("SEO ogDescription must be at most 320 characters"),
  body("seo.ogImage").optional().isString().withMessage("SEO ogImage must be a string"),
  body("seo.canonicalUrl").optional().isString().withMessage("SEO canonicalUrl must be a string"),
  body("seo.robots").optional().isString().isLength({ max: 100 }).withMessage("SEO robots must be at most 100 characters")
];

export const collectionIdParamValidator = [
  param("id").isMongoId().withMessage("Valid collection id is required")
];

export const collectionSlugParamValidator = [
  param("slug").trim().notEmpty().withMessage("Collection slug is required")
];

export const collectionListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("search").optional().trim(),
  query("productType").optional().isIn(productTypes).withMessage("Invalid product type"),
  query("featured").optional().isBoolean().withMessage("featured must be a boolean"),
  query("showOnHomepage").optional().isBoolean().withMessage("showOnHomepage must be a boolean")
];

export const collectionProductListValidator = [
  ...collectionSlugParamValidator,
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("search").optional().trim(),
  query("productType").optional().isIn(productTypes).withMessage("Invalid product type"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a non-negative number"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a non-negative number"),
  query("sort")
    .optional()
    .isIn(["latest", "price_asc", "price_desc", "name_asc", "name_desc"])
    .withMessage("Invalid sort option")
];

const baseValidator = [
  body("title").optional().trim().notEmpty().withMessage("Collection title is required"),
  body("slug").optional().trim().notEmpty().withMessage("Collection slug cannot be empty"),
  body("shortDescription").optional().trim(),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("heroImage").optional().isString().withMessage("heroImage must be a string"),
  body("thumbnail").optional().isString().withMessage("thumbnail must be a string"),
  body("productIds").optional().isArray().withMessage("productIds must be an array"),
  body("productIds.*").optional().isMongoId().withMessage("Each product id must be valid"),
  body("productType").optional().isIn(productTypes).withMessage("Invalid product type"),
  body("about").optional().isString().withMessage("About must be a string"),
  body("whoShouldWear").optional().isString().withMessage("whoShouldWear must be a string"),
  body("benefits").optional().isString().withMessage("Benefits must be a string"),
  body("qualityAndPrice").optional().isString().withMessage("qualityAndPrice must be a string"),
  body("faqs").optional().isArray().withMessage("FAQs must be an array"),
  body("faqs.*.question").optional().isString().withMessage("FAQ question must be a string"),
  body("faqs.*.answer").optional().isString().withMessage("FAQ answer must be a string"),
  body("filtersConfig").optional().isObject().withMessage("filtersConfig must be an object"),
  body("sortOrder").optional().isInt().withMessage("sortOrder must be an integer"),
  body("showOnHomepage").optional().isBoolean().withMessage("showOnHomepage must be a boolean"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
  body("status").optional().isIn(statuses).withMessage("Invalid collection status"),
  ...seoValidator
];

export const createCollectionValidator = [
  body("title").trim().notEmpty().withMessage("Collection title is required"),
  ...baseValidator
];

export const updateCollectionValidator = [
  ...collectionIdParamValidator,
  ...baseValidator
];
