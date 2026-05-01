import mongoose from "mongoose";
import makeSlug from "../utils/slugify.js";
import sanitizeHtml from "../utils/sanitizeHtml.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const pageSeoSchema = new mongoose.Schema(
  {
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
  { _id: false }
);

const pageSchema = new mongoose.Schema(
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
    pageType: {
      type: String,
      enum: [
        "custom",
        "about",
        "contact",
        "privacy-policy",
        "terms",
        "shipping-policy",
        "refund-policy",
        "faq-page"
      ],
      default: "custom"
    },
    content: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    showInHeader: {
      type: Boolean,
      default: false
    },
    showInFooter: {
      type: Boolean,
      default: false
    },
    seo: {
      type: pageSeoSchema,
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

pageSchema.index({ status: 1 });
pageSchema.index({ pageType: 1 });

pageSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = makeSlug(this.title);
  } else if (this.slug) {
    this.slug = makeSlug(this.slug);
  }

  next();
});

pageSchema.pre("save", function (next) {
  this.title = sanitizeString(this.title || "");
  this.slug = makeSlug(this.slug || this.title || "");
  this.content = sanitizeHtml(this.content || "");

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

const Page = mongoose.model("Page", pageSchema);

export default Page;
