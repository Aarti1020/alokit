import mongoose from "mongoose";
import makeSlug from "../utils/slugify.js";
import sanitizeHtml from "../utils/sanitizeHtml.js";
import extractReadTime from "../utils/extractReadTime.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const blogSeoSchema = new mongoose.Schema(
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

const blogSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    featuredImage: {
      type: String,
      default: ""
    },
    images: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      default: ""
    },
    authorName: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },
    readTime: {
      type: Number,
      default: 1
    },
    seo: {
      type: blogSeoSchema,
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

blogSchema.index({ status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });

blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = makeSlug(this.title);
  } else if (this.slug) {
    this.slug = makeSlug(this.slug);
  }

  next();
});

blogSchema.pre("save", function (next) {
  this.title = sanitizeString(this.title || "");
  this.slug = makeSlug(this.slug || this.title || "");
  this.excerpt = sanitizeString(this.excerpt || "");
  this.content = sanitizeHtml(this.content || "");
  this.featuredImage = sanitizeString(this.featuredImage || "");
  this.images = (this.images || []).map((image) => sanitizeString(image || ""));
  this.tags = (this.tags || []).map((tag) => sanitizeString(tag || "")).filter(Boolean);
  this.category = sanitizeString(this.category || "");
  this.authorName = sanitizeString(this.authorName || "");
  this.readTime = extractReadTime(this.content || "");

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

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
