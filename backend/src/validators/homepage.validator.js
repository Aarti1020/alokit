import { body, param } from "express-validator";

const sectionTypes = [
  "hero",
  "announcement",
  "featuredCategories",
  "featuredProducts",
  "imageText",
  "trustBadges",
  "testimonials",
  "blogPreview",
  "faqPreview",
  "cta",
  "customHtml",
  "trust_badges",
  "category_explorer",
  "collection_grid",
  "product_slider",
  "image_text",
  "faq_preview",
  "reviews_preview",
  "newsletter",
  "custom_html"
];
const sectionStatuses = ["active", "inactive"];

export const homepageSectionIdParamValidator = [
  param("id").isMongoId().withMessage("Valid homepage section id is required")
];

const baseHomepageValidator = [
  body("key").optional().trim().notEmpty().withMessage("Section key is required"),
  body("title").optional().trim(),
  body("sectionType").optional().isIn(sectionTypes).withMessage("Invalid section type"),
  body("data").optional().isObject().withMessage("Homepage section data must be an object"),
  body("status").optional().isIn(sectionStatuses).withMessage("Invalid section status"),
  body("sortOrder").optional().isInt().withMessage("sortOrder must be an integer")
];

export const createHomepageSectionValidator = [
  body("key").trim().notEmpty().withMessage("Section key is required"),
  body("sectionType").isIn(sectionTypes).withMessage("Invalid section type"),
  body("data").optional().isObject().withMessage("Homepage section data must be an object"),
  ...baseHomepageValidator
];

export const updateHomepageSectionValidator = [
  ...homepageSectionIdParamValidator,
  ...baseHomepageValidator
];
