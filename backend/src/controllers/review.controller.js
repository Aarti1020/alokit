import Review from "../models/Review.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildReviewFilterQuery } from "../utils/buildFilterQuery.js";
import getPagination from "../utils/pagination.js";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";
import { buildSpamSafeSuccess, hasFilledHoneypot } from "../utils/spamGuard.js";
import {
  createReview as createReviewService,
  getApprovedProductReviews as getApprovedProductReviewsService,
  getReviews as getReviewsService,
  updateReviewStatus as updateReviewStatusService
} from "../services/review.service.js";

export const submitReview = asyncHandler(async (req, res) => {
  const payload = sanitizeObject(req.body);

  if (hasFilledHoneypot(req.body)) {
    return res.status(202).json(buildSpamSafeSuccess("Review submitted successfully"));
  }

  const product = await Product.findById(payload.product);

  if (!product || product.status !== "published") {
    throw new ApiError(404, "Published product not found");
  }

  const review = await createReviewService({
    product: payload.product,
    name: payload.name,
    email: payload.email || "",
    rating: Number(payload.rating),
    title: payload.title || "",
    comment: payload.comment,
    status: "pending"
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: review
  });
});

export const getAdminReviews = asyncHandler(async (req, res) => {
  const filter = buildReviewFilterQuery(req.query);
  const { page, limit, skip } = getPagination(req.query);

  const [reviews, total] = await Promise.all([
    getReviewsService(filter, skip, limit),
    Review.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    results: reviews.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: reviews
  });
});

export const getProductApprovedReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const { page, limit, skip } = getPagination(req.query);
  const filter = {
    product: req.params.productId,
    status: "approved"
  };

  const [reviews, total] = await Promise.all([
    getApprovedProductReviewsService(req.params.productId, skip, limit),
    Review.countDocuments(filter)
  ]);

  const ratingSummary = await Review.aggregate([
    {
      $match: {
        product: product._id,
        status: "approved"
      }
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRatings = 0;
  let weightedSum = 0;

  ratingSummary.forEach((item) => {
    ratingBreakdown[item._id] = item.count;
    totalRatings += item.count;
    weightedSum += item._id * item.count;
  });

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    results: reviews.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    summary: {
      averageRating: totalRatings ? Number((weightedSum / totalRatings).toFixed(1)) : 0,
      totalReviews: totalRatings,
      ratingBreakdown
    },
    data: reviews
  });
});

export const getFeaturedReviews = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const reviews = await Review.find({
    status: "approved",
    isFeatured: true
  })
    .populate("product", "name title slug featuredImage thumbnail")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Featured reviews fetched successfully",
    results: reviews.length,
    data: reviews
  });
});

export const approveReview = asyncHandler(async (req, res) => {
  const review = await updateReviewStatusService(req.params.id, {
    status: "approved",
    rejectionReason: "",
    isFeatured: false,
    approvedBy: req.user._id,
    approvedAt: new Date()
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    message: "Review approved successfully",
    data: review
  });
});

export const rejectReview = asyncHandler(async (req, res) => {
  const rejectionReason = sanitizeString(req.body.rejectionReason || "");
  const review = await updateReviewStatusService(req.params.id, {
    status: "rejected",
    rejectionReason,
    isFeatured: false,
    approvedBy: null,
    approvedAt: null
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    message: "Review rejected successfully",
    data: review
  });
});

export const hideReview = asyncHandler(async (req, res) => {
  const review = await updateReviewStatusService(req.params.id, {
    status: "hidden",
    isFeatured: false
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  res.status(200).json({
    success: true,
    message: "Review hidden successfully",
    data: review
  });
});

export const featureReview = asyncHandler(async (req, res) => {
  const existingReview = await Review.findById(req.params.id);

  if (!existingReview) {
    throw new ApiError(404, "Review not found");
  }

  const review = await updateReviewStatusService(req.params.id, {
    isFeatured: !existingReview.isFeatured
  });

  res.status(200).json({
    success: true,
    message: "Review feature status updated successfully",
    data: review
  });
});
