import mongoose from "mongoose";
import makeSlug from "../utils/slugify.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["hero", "promo", "category", "popup", "announcement"],
      default: "promo"
    },
    image: {
      type: String,
      default: ""
    },
    mobileImage: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    buttonText: {
      type: String,
      default: ""
    },
    page: {
      type: String,
      enum: ["homepage", "category", "product", "blog", "global", "collection"],
      default: "homepage"
    },
    position: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isClickable: {
      type: Boolean,
      default: true
    },
    targetType: {
      type: String,
      enum: ["url", "product", "category", "page", "blog", "collection"],
      default: "url"
    },
    targetValue: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

bannerSchema.index({ page: 1 });
bannerSchema.index({ type: 1 });
bannerSchema.index({ status: 1 });
bannerSchema.index({ sortOrder: 1 });

bannerSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = makeSlug(this.title);
  } else if (this.slug) {
    this.slug = makeSlug(this.slug);
  }

  next();
});

bannerSchema.pre("save", function (next) {
  this.title = sanitizeString(this.title || "");
  this.slug = makeSlug(this.slug || this.title || "");
  this.image = sanitizeString(this.image || "");
  this.mobileImage = sanitizeString(this.mobileImage || "");
  this.link = sanitizeString(this.link || "");
  this.buttonText = sanitizeString(this.buttonText || "");
  this.position = sanitizeString(this.position || "");
  this.targetValue = sanitizeString(this.targetValue || "");
  next();
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
