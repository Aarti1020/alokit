import Banner from "../models/Banner.js";
import Blog from "../models/Blog.js";
import Collection from "../models/Collection.js";
import FAQ from "../models/FAQ.js";
import HomepageSection from "../models/HomepageSection.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import SEOConfig from "../models/SEOConfig.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sanitizeString } from "../utils/sanitizeInput.js";
import { getRequestBaseUrl, resolveAssetUrl } from "../utils/assetUrl.js";
import { serializeProduct } from "./product.controller.js";

const activeDateFilter = () => {
  const now = new Date();

  return {
    $and: [
      {
        $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }]
      },
      {
        $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }]
      }
    ]
  };
};

const assignHomepageSectionFields = (section, payload) => {
  if (payload.key !== undefined) section.key = sanitizeString(payload.key);
  if (payload.title !== undefined) section.title = sanitizeString(payload.title);
  if (payload.sectionType !== undefined) section.sectionType = payload.sectionType;
  if (payload.data !== undefined) section.data = payload.data;
  if (payload.status !== undefined) section.status = payload.status;
  if (payload.sortOrder !== undefined) section.sortOrder = payload.sortOrder;
};

const ensureUniqueKey = async (key, excludedId = null) => {
  const duplicate = await HomepageSection.findOne({
    key,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "Homepage section key already exists");
  }
};

export const getHomepage = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const [sections, heroBanners, homepageFaqs, featuredBlogs, featuredCollections, featuredProducts, featuredReviews, seo] = await Promise.all([
    HomepageSection.find({ status: "active" }).sort({ sortOrder: 1, createdAt: -1 }),
    Banner.find({
      status: "active",
      page: "homepage",
      type: { $in: ["hero", "announcement", "promo"] },
      ...activeDateFilter()
    }).sort({ sortOrder: 1, createdAt: -1 }),
    FAQ.find({
      status: "active",
      $or: [{ module: "homepage" }, { isFeatured: true }]
    }).sort({ sortOrder: 1, createdAt: -1 }),
    Blog.find({
      status: "published",
      isFeatured: true
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3),
    Collection.find({
      status: "published",
      $or: [{ showOnHomepage: true }, { isFeatured: true }]
    }).sort({ sortOrder: 1, createdAt: -1 }).limit(6),
    Product.find({
      status: { $in: ["published", "active"] },
      $or: [{ showOnHomepage: true }, { isFeatured: true }]
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ showOnHomepage: -1, isFeatured: -1, createdAt: -1 })
      .limit(12),
    Review.find({
      status: "approved",
      isFeatured: true
    })
      .populate("product", "name title slug featuredImage thumbnail")
      .sort({ createdAt: -1 })
      .limit(6),
    SEOConfig.findOne({ pageKey: "homepage" })
  ]);

  res.status(200).json({
    success: true,
    message: "Homepage content fetched successfully",
    data: {
      sections,
      banners: heroBanners,
      faqs: homepageFaqs,
      featuredBlogs,
      featuredCollections,
      featuredProducts: featuredProducts.map((product) => serializeProduct(product, { baseUrl })),
      featuredReviews: featuredReviews.map((review) => {
        const item = review.toObject ? review.toObject() : review;

        if (item.product) {
          item.product = {
            ...item.product,
            featuredImage: resolveAssetUrl(item.product.featuredImage || "", baseUrl),
            thumbnail: resolveAssetUrl(item.product.thumbnail || "", baseUrl)
          };
        }

        return item;
      }),
      seo,
      newsletter: {
        subscribeEndpoint: "/api/v1/newsletter/subscribe"
      },
      leadForms: {
        gemstoneRecommendationEndpoint: "/api/v1/leads/gemstone-recommendation",
        rudrakshaRecommendationEndpoint: "/api/v1/leads/rudraksha-recommendation",
        contactEndpoint: "/api/v1/contact"
      }
    }
  });
});

export const getHomepageSections = asyncHandler(async (req, res) => {
  const sections = await HomepageSection.find().sort({ sortOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Homepage sections fetched successfully",
    results: sections.length,
    data: sections
  });
});

export const getHomepageSectionById = asyncHandler(async (req, res) => {
  const section = await HomepageSection.findById(req.params.id);

  if (!section) {
    throw new ApiError(404, "Homepage section not found");
  }

  res.status(200).json({
    success: true,
    message: "Homepage section fetched successfully",
    data: section
  });
});

export const createHomepageSection = asyncHandler(async (req, res) => {
  const section = new HomepageSection();
  assignHomepageSectionFields(section, req.body);
  await ensureUniqueKey(section.key);
  await section.save();

  res.status(201).json({
    success: true,
    message: "Homepage section created successfully",
    data: section
  });
});

export const updateHomepageSection = asyncHandler(async (req, res) => {
  const section = await HomepageSection.findById(req.params.id);

  if (!section) {
    throw new ApiError(404, "Homepage section not found");
  }

  assignHomepageSectionFields(section, req.body);
  await ensureUniqueKey(section.key, section._id);
  await section.save();

  res.status(200).json({
    success: true,
    message: "Homepage section updated successfully",
    data: section
  });
});

export const deleteHomepageSection = asyncHandler(async (req, res) => {
  const section = await HomepageSection.findByIdAndDelete(req.params.id);

  if (!section) {
    throw new ApiError(404, "Homepage section not found");
  }

  res.status(200).json({
    success: true,
    message: "Homepage section deleted successfully"
  });
});
