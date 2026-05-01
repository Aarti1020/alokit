import Review from "../models/Review.js";

const reviewPopulate = [
  { path: "product", select: "name slug" },
  { path: "approvedBy", select: "fullName email" }
];

const createReview = async (payload) => {
  const review = await Review.create(payload);
  return Review.findById(review._id).populate(reviewPopulate);
};

const getReviews = async (filter, skip, limit) => {
  return Review.find(filter)
    .populate(reviewPopulate)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const getApprovedProductReviews = async (productId, skip, limit) => {
  return Review.find({
    product: productId,
    status: "approved"
  })
    .populate(reviewPopulate)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const updateReviewStatus = async (id, updateData) => {
  return Review.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate(reviewPopulate);
};

export { createReview, getReviews, getApprovedProductReviews, updateReviewStatus };
