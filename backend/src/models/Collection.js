import mongoose from "mongoose";
import makeSlug from "../utils/slugify.js";
import sanitizeHtml from "../utils/sanitizeHtml.js";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";

const collectionSeoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    robots: { type: String, default: "index,follow" }
  },
  { _id: false }
);

const collectionFaqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" }
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    heroImage: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      default: ""
    },
    productIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: []
    },
    productType: {
      type: String,
      enum: ["gemstone", "rudraksha", "bracelet", "jewellery", "crystal", ""],
      default: ""
    },
    about: {
      type: String,
      default: ""
    },
    whoShouldWear: {
      type: String,
      default: ""
    },
    benefits: {
      type: String,
      default: ""
    },
    qualityAndPrice: {
      type: String,
      default: ""
    },
    faqs: {
      type: [collectionFaqSchema],
      default: []
    },
    filtersConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    showOnHomepage: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    seo: {
      type: collectionSeoSchema,
      default: () => ({})
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

collectionSchema.index({ status: 1 });
collectionSchema.index({ showOnHomepage: 1 });
collectionSchema.index({ isFeatured: 1 });
collectionSchema.index({ sortOrder: 1 });

collectionSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = makeSlug(this.title);
  } else if (this.slug) {
    this.slug = makeSlug(this.slug);
  }

  next();
});

collectionSchema.pre("save", function (next) {
  this.title = sanitizeString(this.title || "");
  this.slug = makeSlug(this.slug || this.title || "");
  this.shortDescription = sanitizeString(this.shortDescription || "");
  this.description = sanitizeHtml(this.description || "");
  this.heroImage = sanitizeString(this.heroImage || "");
  this.thumbnail = sanitizeString(this.thumbnail || "");
  this.about = sanitizeHtml(this.about || "");
  this.whoShouldWear = sanitizeHtml(this.whoShouldWear || "");
  this.benefits = sanitizeHtml(this.benefits || "");
  this.qualityAndPrice = sanitizeHtml(this.qualityAndPrice || "");
  this.filtersConfig = sanitizeObject(this.filtersConfig || {});
  this.faqs = (this.faqs || []).map((faq) => ({
    question: sanitizeString(faq.question || ""),
    answer: sanitizeHtml(faq.answer || "")
  }));

  if (this.seo) {
    this.seo.metaTitle = sanitizeString(this.seo.metaTitle || "");
    this.seo.metaDescription = sanitizeString(this.seo.metaDescription || "");
    this.seo.metaKeywords = (this.seo.metaKeywords || [])
      .map((keyword) => sanitizeString(keyword || ""))
      .filter(Boolean);
    this.seo.ogTitle = sanitizeString(this.seo.ogTitle || "");
    this.seo.ogDescription = sanitizeString(this.seo.ogDescription || "");
    this.seo.ogImage = sanitizeString(this.seo.ogImage || "");
    this.seo.canonicalUrl = sanitizeString(this.seo.canonicalUrl || "");
    this.seo.robots = sanitizeString(this.seo.robots || "index,follow");
  }

  next();
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
