import express from "express";
import {
  approveReview,
  featureReview,
  getAdminReviews,
  getFeaturedReviews,
  getProductApprovedReviews,
  hideReview,
  rejectReview,
  submitReview
} from "../controllers/review.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  adminReviewListValidator,
  featuredReviewsValidator,
  productReviewsValidator,
  rejectReviewValidator,
  reviewIdValidator,
  submitReviewValidator
} from "../validators/review.validator.js";

const router = express.Router();

router.post("/", submitReviewValidator, validate, submitReview);
router.get("/featured", featuredReviewsValidator, validate, getFeaturedReviews);
router.get("/product/:productId", productReviewsValidator, validate, getProductApprovedReviews);

router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  adminReviewListValidator,
  validate,
  getAdminReviews
);
router.patch(
  "/:id/approve",
  protect,
  authorize("admin", "superAdmin"),
  reviewIdValidator,
  validate,
  approveReview
);
router.patch(
  "/:id/reject",
  protect,
  authorize("admin", "superAdmin"),
  rejectReviewValidator,
  validate,
  rejectReview
);
router.patch(
  "/:id/hide",
  protect,
  authorize("admin", "superAdmin"),
  reviewIdValidator,
  validate,
  hideReview
);
router.patch(
  "/:id/feature",
  protect,
  authorize("admin", "superAdmin"),
  reviewIdValidator,
  validate,
  featureReview
);

export default router;
