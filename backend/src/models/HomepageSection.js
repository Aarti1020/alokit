import mongoose from "mongoose";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";

const homepageSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      default: ""
    },
    sectionType: {
      type: String,
      enum: [
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
      ],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

homepageSectionSchema.index({ status: 1 });
homepageSectionSchema.index({ sortOrder: 1 });

homepageSectionSchema.pre("save", function (next) {
  this.key = sanitizeString(this.key || "");
  this.title = sanitizeString(this.title || "");
  this.data = sanitizeObject(this.data || {});
  next();
});

const HomepageSection = mongoose.model("HomepageSection", homepageSectionSchema);

export default HomepageSection;
