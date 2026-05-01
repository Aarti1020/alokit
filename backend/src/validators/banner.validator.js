import { body, param, query } from "express-validator";

const bannerTypes = ["hero", "promo", "category", "popup", "announcement"];
const bannerPages = ["homepage", "category", "product", "blog", "global", "collection"];
const bannerStatuses = ["active", "inactive"];
const targetTypes = ["url", "product", "category", "page", "blog", "collection"];

export const bannerIdParamValidator = [
  param("id").isMongoId().withMessage("Valid banner id is required")
];

export const publicBannerListValidator = [
  query("page").optional().isIn(bannerPages).withMessage("Invalid banner page"),
  query("type").optional().isIn(bannerTypes).withMessage("Invalid banner type")
];

const baseBannerValidator = [
  body("title").optional().trim().notEmpty().withMessage("Banner title is required"),
  body("slug").optional().trim().notEmpty().withMessage("Banner slug cannot be empty"),
  body("type").optional().isIn(bannerTypes).withMessage("Invalid banner type"),
  body("image").optional().trim(),
  body("mobileImage").optional().trim(),
  body("link").optional().trim(),
  body("buttonText").optional().trim(),
  body("page").optional().isIn(bannerPages).withMessage("Invalid banner page"),
  body("position").optional().trim(),
  body("status").optional().isIn(bannerStatuses).withMessage("Invalid banner status"),
  body("startDate").optional().isISO8601().withMessage("startDate must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date")
    .custom((value, { req }) => {
      if (req.body.startDate && value && new Date(value) < new Date(req.body.startDate)) {
        throw new Error("endDate cannot be earlier than startDate");
      }

      return true;
    }),
  body("sortOrder").optional().isInt().withMessage("sortOrder must be an integer"),
  body("isClickable").optional().isBoolean().withMessage("isClickable must be a boolean"),
  body("targetType").optional().isIn(targetTypes).withMessage("Invalid targetType"),
  body("targetValue").optional().trim()
];

export const createBannerValidator = [
  body("title").trim().notEmpty().withMessage("Banner title is required"),
  ...baseBannerValidator
];

export const updateBannerValidator = [
  ...bannerIdParamValidator,
  ...baseBannerValidator
];
