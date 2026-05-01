import { body, param, query } from "express-validator";
import { hasProductImageContent } from "../utils/productImages.js";

const productTypes = ["gemstone", "rudraksha", "bracelet", "jewellery", "crystal"];
const productStatuses = ["draft", "published", "active", "inactive"];
const isProductImageObject = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  (value.url === undefined || typeof value.url === "string") &&
  (value.publicId === undefined || typeof value.publicId === "string") &&
  (value.public_id === undefined || typeof value.public_id === "string") &&
  (value.alt === undefined || typeof value.alt === "string") &&
  (value.isPrimary === undefined || typeof value.isPrimary === "boolean");

export const productIdParamValidator = [
  param("id").isMongoId().withMessage("Valid product id is required")
];

export const productSlugParamValidator = [
  param("slug").trim().notEmpty().withMessage("Product slug is required")
];

export const productListValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("search").optional().trim(),
  query("category").optional().isMongoId().withMessage("Valid category id is required"),
  query("subCategory").optional().isMongoId().withMessage("Valid subcategory id is required"),
  query("productType").optional().isIn(productTypes).withMessage("Invalid product type"),
  query("collection").optional().isMongoId().withMessage("Valid collection id is required"),
  query("featured").optional().isBoolean().withMessage("featured must be a boolean"),
  query("showOnHomepage")
    .optional()
    .isBoolean()
    .withMessage("showOnHomepage must be a boolean"),
  query("inStock").optional().isBoolean().withMessage("inStock must be a boolean"),
  query("stockStatus")
    .optional()
    .isIn(["in_stock", "out_of_stock"])
    .withMessage("stockStatus must be in_stock or out_of_stock"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a non-negative number"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a non-negative number"),
  query("sort").optional().isIn(["latest", "price_asc", "price_desc", "name_asc", "name_desc"]).withMessage("Invalid sort option")
];

const baseProductValidator = [
  body("name").optional().trim().notEmpty().withMessage("Product name is required"),
  body("title").optional().trim().notEmpty().withMessage("Product title is required"),
  body("slug").optional().trim().notEmpty().withMessage("Slug cannot be empty"),
  body("sku").optional({ values: "falsy" }).trim().isString().withMessage("Size must be text"),
  body("category").optional().isMongoId().withMessage("Valid category id is required"),
  body("subCategory").optional().isMongoId().withMessage("Valid subcategory id is required"),
  body("collections").optional().isArray().withMessage("Collections must be an array"),
  body("collections.*").optional().isMongoId().withMessage("Each collection must be a valid id"),
  body("productType")
    .optional()
    .isIn(productTypes)
    .withMessage("Invalid product type"),
  body("shortDescription").optional().trim(),
  body("description").optional().trim(),
  body("featuredImage").optional().isString().withMessage("featuredImage must be a string"),
  body("galleryImages").optional().isArray().withMessage("galleryImages must be an array"),
  body("galleryImages.*").optional().isString().withMessage("Each gallery image must be a string"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*")
    .optional()
    .custom((value) => {
      if (typeof value === "string" || isProductImageObject(value)) {
        return true;
      }

      throw new Error("Each image must be a string or valid image object");
    }),
  body("imageAlts").optional().isArray().withMessage("imageAlts must be an array"),
  body("imageAlts.*").optional().isString().withMessage("Each image alt must be a string"),
  body("thumbnail").optional().isString().withMessage("Thumbnail must be a string"),
  body("basePrice")
    .optional()
    .isNumeric()
    .withMessage("Base price must be a number"),
  body("salePrice")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number"),
  body("emiPrice").optional().isNumeric().withMessage("EMI price must be a number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("lowStockThreshold must be a non-negative integer"),
  body("inStock").optional().isBoolean().withMessage("inStock must be a boolean"),
  body("status").optional().isIn(productStatuses).withMessage("Invalid product status"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
  body("showOnHomepage").optional().isBoolean().withMessage("showOnHomepage must be a boolean"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),
  body("origin").optional().trim(),
  body("shape").optional().trim(),
  body("style").optional().trim(),
  body("weightCarat").optional().isFloat({ min: 0 }).withMessage("weightCarat must be a non-negative number"),
  body("weightRatti").optional().isFloat({ min: 0 }).withMessage("weightRatti must be a non-negative number"),
  body("certificationLab").optional().trim(),
  body("treatment").optional().trim(),
  body("specifications").optional().isObject().withMessage("specifications must be an object"),
  body("variants").optional().isArray().withMessage("variants must be an array"),
  body("variants.*.label").optional().isString().withMessage("Variant label must be a string"),
  body("variants.*.value").optional().isString().withMessage("Variant value must be a string"),
  body("variants.*.price").optional().isFloat({ min: 0 }).withMessage("Variant price must be a non-negative number"),
  body("variants.*.salePrice").optional().isFloat({ min: 0 }).withMessage("Variant salePrice must be a non-negative number"),
  body("variants.*.stock").optional().isInt({ min: 0 }).withMessage("Variant stock must be a non-negative integer"),
  body("variants.*.sku").optional().isString().withMessage("Variant sku must be a string"),
  body("variants.*.image").optional().isString().withMessage("Variant image must be a string"),
  body("seoTitle").optional().trim(),
  body("seoDescription").optional().trim(),
  body("seo").optional().isObject().withMessage("seo must be an object"),
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
  body("seo.metaKeywords.*").optional().isString().withMessage("Each SEO keyword must be a string"),
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

export const createProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product title cannot be empty"),
  body()
    .custom((value, { req }) => {
      if (!req.body.name && !req.body.title) {
        throw new Error("Product name or title is required");
      }

      return true;
    }),
  body("sku").optional({ values: "falsy" }).trim().isString().withMessage("Size must be text"),
  body("category").isMongoId().withMessage("Valid category id is required"),
  body("subCategory").isMongoId().withMessage("Valid subcategory id is required"),
  body("productType").isIn(productTypes).withMessage("Invalid product type"),
  body("basePrice").isNumeric().withMessage("Base price must be a number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body().custom((value, { req }) => {
    if (
      !hasProductImageContent({
        files: req.files,
        images: req.body.images,
        galleryImages: req.body.galleryImages,
        featuredImage: req.body.featuredImage,
        thumbnail: req.body.thumbnail
      })
    ) {
      throw new Error("At least one product image is required");
    }

    return true;
  }),
  ...baseProductValidator
];

export const updateProductValidator = [
  ...productIdParamValidator,
  ...baseProductValidator
];

export const replaceProductImagesValidator = [
  ...productIdParamValidator,
  body("imageAlts").optional().isArray().withMessage("imageAlts must be an array"),
  body("imageAlts.*").optional().isString().withMessage("Each image alt must be a string")
];

export const createAdminProductValidator = [...createProductValidator];
