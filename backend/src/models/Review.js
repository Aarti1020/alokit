import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      default: "",
      trim: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden", "spam"],
      default: "pending"
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
