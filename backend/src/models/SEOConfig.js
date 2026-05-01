import mongoose from "mongoose";
import { sanitizeString } from "../utils/sanitizeInput.js";

const seoConfigSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    metaTitle: {
      type: String,
      default: ""
    },
    metaDescription: {
      type: String,
      default: ""
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    ogTitle: {
      type: String,
      default: ""
    },
    ogDescription: {
      type: String,
      default: ""
    },
    ogImage: {
      type: String,
      default: ""
    },
    canonicalUrl: {
      type: String,
      default: ""
    },
    robots: {
      type: String,
      default: "index,follow"
    }
  },
  { timestamps: true }
);

seoConfigSchema.pre("save", function (next) {
  this.pageKey = sanitizeString(this.pageKey || "");
  this.metaTitle = sanitizeString(this.metaTitle || "");
  this.metaDescription = sanitizeString(this.metaDescription || "");
  this.metaKeywords = (this.metaKeywords || [])
    .map((keyword) => sanitizeString(keyword || ""))
    .filter(Boolean);
  this.ogTitle = sanitizeString(this.ogTitle || "");
  this.ogDescription = sanitizeString(this.ogDescription || "");
  this.ogImage = sanitizeString(this.ogImage || "");
  this.canonicalUrl = sanitizeString(this.canonicalUrl || "");
  this.robots = sanitizeString(this.robots || "index,follow");
  next();
});

const SEOConfig = mongoose.model("SEOConfig", seoConfigSchema);

export default SEOConfig;
