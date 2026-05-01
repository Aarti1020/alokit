import mongoose from "mongoose";
import makeSlug from "../utils/slugify.js";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";
import { normalizeProductMedia } from "../utils/productImages.js";

const productSeoSchema = new mongoose.Schema(
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

const productVariantSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    sku: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const productImageSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const productVideoSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    mimeType: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    _id: false
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      default: "",
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: String,
      default: "",
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    productType: {
      type: String,
      enum: ["gemstone", "rudraksha", "bracelet", "jewellery", "crystal"],
      required: true
    },

    shortDescription: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    featuredImage: {
      type: String,
      default: ""
    },
    galleryImages: {
      type: [String],
      default: []
    },

    images: {
      type: [productImageSchema],
      default: []
    },
    thumbnail: {
      type: String,
      default: ""
    },
    productVideo: {
      type: productVideoSchema,
      default: null
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(value) {
          const basePrice =
            typeof this.get === "function" ? this.get("basePrice") : this.basePrice;

          if (basePrice === undefined || basePrice === null || basePrice === "") {
            return true;
          }

          return Number(value) <= Number(basePrice);
        },
        message: "Sale price cannot be greater than base price"
      }
    },
    emiPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      enum: ["draft", "published", "active", "inactive"],
      default: "inactive"
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },

    isFeatured: {
      type: Boolean,
      default: false
    },
    showOnHomepage: {
      type: Boolean,
      default: false
    },

    tags: {
      type: [String],
      default: []
    },

    // gemstone/rudraksha type fields
    origin: {
      type: String,
      default: ""
    },
    shape: {
      type: String,
      default: ""
    },
    style: {
      type: String,
      default: ""
    },
    weightCarat: {
      type: Number,
      default: 0
    },
    weightRatti: {
      type: Number,
      default: 0
    },
    certificationLab: {
      type: String,
      default: ""
    },
    treatment: {
      type: String,
      default: ""
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    variants: {
      type: [productVariantSchema],
      default: []
    },
    collections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Collection",
      default: []
    },

    seoTitle: {
      type: String,
      default: ""
    },
    seoDescription: {
      type: String,
      default: ""
    },
    seo: {
      type: productSeoSchema,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ showOnHomepage: 1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual("primaryImage").get(function () {
  return (
    this.images?.find((image) => image?.isPrimary)?.url ||
    this.thumbnail ||
    this.featuredImage ||
    this.galleryImages?.[0] ||
    this.images?.[0]?.url ||
    ""
  );
});

productSchema.virtual("effectivePrice").get(function () {
  return this.salePrice > 0 ? this.salePrice : this.basePrice;
});

productSchema.pre("validate", function (next) {
  if (!this.title && this.name) {
    this.title = this.name;
  }

  if (!this.name && this.title) {
    this.name = this.title;
  }

  if (!this.slug) {
    this.slug = makeSlug(this.title || this.name || "");
  } else {
    this.slug = makeSlug(this.slug);
  }

  if (this.status === "published") {
    this.status = "active";
  }

  if (this.status === "draft") {
    this.status = "inactive";
  }

  const media = normalizeProductMedia(this, {
    fallbackAlt: this.title || this.name || "",
    logContext: "Product model pre-validate"
  });

  this.images = media.images;

  next();
});

productSchema.pre("save", function (next) {
  this.name = sanitizeString(this.name || this.title || "");
  this.title = sanitizeString(this.title || this.name || "");
  this.shortDescription = sanitizeString(this.shortDescription || "");
  this.description = typeof this.description === "string" ? this.description.trim() : "";
  const media = normalizeProductMedia(this, {
    fallbackAlt: this.title || this.name || "",
    logContext: "Product model pre-save"
  });

  this.images = media.images.map(
    (image, index, list) => ({
      publicId: sanitizeString(image.publicId || ""),
      url: sanitizeString(image.url || ""),
      alt: sanitizeString(image.alt || this.title || this.name || ""),
      isPrimary: list.some((item) => item.isPrimary) ? Boolean(image.isPrimary) : index === 0
    })
  );
  this.featuredImage = media.featuredImage;
  this.galleryImages = media.galleryImages;
  this.thumbnail = media.thumbnail;
  if (this.productVideo?.url) {
    this.productVideo = {
      publicId: sanitizeString(this.productVideo.publicId || ""),
      url: sanitizeString(this.productVideo.url || ""),
      mimeType: sanitizeString(this.productVideo.mimeType || ""),
      size: Number.isFinite(Number(this.productVideo.size)) ? Number(this.productVideo.size) : 0
    };
  } else {
    this.productVideo = null;
  }

  this.tags = (this.tags || []).map((tag) => sanitizeString(tag || "")).filter(Boolean);
  this.origin = sanitizeString(this.origin || "");
  this.shape = sanitizeString(this.shape || "");
  this.style = sanitizeString(this.style || "");
  this.certificationLab = sanitizeString(this.certificationLab || "");
  this.treatment = sanitizeString(this.treatment || "");
  this.specifications = sanitizeObject(this.specifications || {});
  this.lowStockThreshold = Number.isFinite(Number(this.lowStockThreshold))
    ? Math.max(0, Number(this.lowStockThreshold))
    : 5;
  this.soldCount = Number.isFinite(Number(this.soldCount))
    ? Math.max(0, Number(this.soldCount))
    : 0;
  if (this.isDeleted) {
    this.status = "inactive";
    this.deletedAt = this.deletedAt || new Date();
  } else if (!this.deletedAt) {
    this.deletedAt = null;
  }
  this.inStock = this.stock > 0;
  this.emiPrice =
    this.emiPrice && Number(this.emiPrice) > 0
      ? Number(this.emiPrice)
      : Math.floor((this.salePrice > 0 ? this.salePrice : this.basePrice) / 8);

  if (this.seo) {
    this.seo.metaTitle = sanitizeString(this.seo.metaTitle || this.seoTitle || this.title);
    this.seo.metaDescription = sanitizeString(
      this.seo.metaDescription || this.seoDescription || this.shortDescription
    );
    this.seo.metaKeywords = (this.seo.metaKeywords || [])
      .map((keyword) => sanitizeString(keyword || ""))
      .filter(Boolean);
    this.seo.ogTitle = sanitizeString(this.seo.ogTitle || this.title);
    this.seo.ogDescription = sanitizeString(
      this.seo.ogDescription || this.shortDescription
    );
    this.seo.ogImage = sanitizeString(
      this.seo.ogImage || this.featuredImage || this.thumbnail
    );
    this.seo.canonicalUrl = sanitizeString(this.seo.canonicalUrl || "");
    this.seo.robots = sanitizeString(this.seo.robots || "index,follow");
  }

  this.seoTitle = sanitizeString(this.seoTitle || this.seo?.metaTitle || "");
  this.seoDescription = sanitizeString(
    this.seoDescription || this.seo?.metaDescription || ""
  );

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
