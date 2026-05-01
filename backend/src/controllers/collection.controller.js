import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import getPagination from "../utils/pagination.js";
import makeSlug from "../utils/slugify.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const ensureUniqueSlug = async (slug, excludedId = null) => {
  const duplicate = await Collection.findOne({
    slug,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "Collection slug already exists");
  }
};

const normalizeSeo = (seo = {}) => ({
  metaTitle: seo.metaTitle || "",
  metaDescription: seo.metaDescription || "",
  metaKeywords: Array.isArray(seo.metaKeywords) ? seo.metaKeywords : [],
  ogTitle: seo.ogTitle || "",
  ogDescription: seo.ogDescription || "",
  ogImage: seo.ogImage || "",
  canonicalUrl: seo.canonicalUrl || "",
  robots: seo.robots || "index,follow"
});

const assignCollectionFields = (collection, payload, userId) => {
  if (payload.title !== undefined) {
    collection.title = sanitizeString(payload.title);

    if (payload.slug === undefined) {
      collection.slug = makeSlug(payload.title);
    }
  }
  if (payload.slug !== undefined) collection.slug = makeSlug(payload.slug);
  if (payload.shortDescription !== undefined) collection.shortDescription = payload.shortDescription;
  if (payload.description !== undefined) collection.description = payload.description;
  if (payload.heroImage !== undefined) collection.heroImage = payload.heroImage;
  if (payload.thumbnail !== undefined) collection.thumbnail = payload.thumbnail;
  if (payload.productIds !== undefined) collection.productIds = payload.productIds || [];
  if (payload.productType !== undefined) collection.productType = payload.productType;
  if (payload.about !== undefined) collection.about = payload.about;
  if (payload.whoShouldWear !== undefined) collection.whoShouldWear = payload.whoShouldWear;
  if (payload.benefits !== undefined) collection.benefits = payload.benefits;
  if (payload.qualityAndPrice !== undefined) collection.qualityAndPrice = payload.qualityAndPrice;
  if (payload.faqs !== undefined) collection.faqs = payload.faqs || [];
  if (payload.filtersConfig !== undefined) collection.filtersConfig = payload.filtersConfig || {};
  if (payload.sortOrder !== undefined) collection.sortOrder = payload.sortOrder;
  if (payload.showOnHomepage !== undefined) collection.showOnHomepage = payload.showOnHomepage;
  if (payload.isFeatured !== undefined) collection.isFeatured = payload.isFeatured;
  if (payload.status !== undefined) collection.status = payload.status;
  if (payload.seo !== undefined) collection.seo = normalizeSeo(payload.seo);
  if (!collection.createdBy) collection.createdBy = userId;
  collection.updatedBy = userId;
};

const buildCollectionFilter = (query = {}, { admin = false } = {}) => {
  const filter = admin ? {} : { status: "published" };

  if (query.search) {
    filter.title = { $regex: query.search, $options: "i" };
  }

  if (query.productType) filter.productType = query.productType;
  if (query.featured !== undefined) filter.isFeatured = query.featured === "true";
  if (query.showOnHomepage !== undefined) {
    filter.showOnHomepage = query.showOnHomepage === "true";
  }

  return filter;
};

const mapProductSortOption = (sort) => {
  switch (sort) {
    case "price_asc":
      return { salePrice: 1, basePrice: 1, createdAt: -1 };
    case "price_desc":
      return { salePrice: -1, basePrice: -1, createdAt: -1 };
    case "name_asc":
      return { title: 1, name: 1 };
    case "name_desc":
      return { title: -1, name: -1 };
    case "latest":
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
};

export const getCollections = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = buildCollectionFilter(req.query);
  const [collections, total] = await Promise.all([
    Collection.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit),
    Collection.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: "Collections fetched successfully",
    results: collections.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: collections
  });
});

export const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    slug: req.params.slug,
    status: "published"
  });

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  res.status(200).json({
    success: true,
    message: "Collection fetched successfully",
    data: collection
  });
});

export const getCollectionProducts = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    slug: req.params.slug,
    status: "published"
  });

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  const { page, limit, skip } = getPagination(req.query);
  const productFilter = {
    status: "published",
    $or: [{ collections: collection._id }, { _id: { $in: collection.productIds } }]
  };

  if (req.query.productType) {
    productFilter.productType = req.query.productType;
  }

  if (req.query.search) {
    productFilter.$and = [
      ...(productFilter.$and || []),
      {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { title: { $regex: req.query.search, $options: "i" } },
          { shortDescription: { $regex: req.query.search, $options: "i" } }
        ]
      }
    ];
  }

  if (req.query.minPrice || req.query.maxPrice) {
    const priceConditions = [];
    const priceExpression = {
      $cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$basePrice"]
    };

    if (req.query.minPrice) {
      priceConditions.push({
        $gte: [priceExpression, Number(req.query.minPrice)]
      });
    }

    if (req.query.maxPrice) {
      priceConditions.push({
        $lte: [priceExpression, Number(req.query.maxPrice)]
      });
    }

    productFilter.$expr =
      priceConditions.length > 1 ? { $and: priceConditions } : priceConditions[0];
  }

  const [products, total] = await Promise.all([
    Product.find(productFilter)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort(mapProductSortOption(req.query.sort))
      .skip(skip)
      .limit(limit),
    Product.countDocuments(productFilter)
  ]);

  res.status(200).json({
    success: true,
    message: "Collection products fetched successfully",
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: {
      collection,
      products
    }
  });
});

export const getAdminCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find(buildCollectionFilter(req.query, { admin: true })).sort({
    sortOrder: 1,
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    message: "Collections fetched successfully",
    results: collections.length,
    data: collections
  });
});

export const getAdminCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  res.status(200).json({
    success: true,
    message: "Collection fetched successfully",
    data: collection
  });
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = new Collection();
  assignCollectionFields(collection, req.body, req.user._id);
  await ensureUniqueSlug(collection.slug || makeSlug(collection.title || ""));
  await collection.save();

  await Product.updateMany(
    { _id: { $in: collection.productIds } },
    { $addToSet: { collections: collection._id } }
  );

  res.status(201).json({
    success: true,
    message: "Collection created successfully",
    data: collection
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  assignCollectionFields(collection, req.body, req.user._id);
  await ensureUniqueSlug(collection.slug || makeSlug(collection.title || ""), collection._id);
  await collection.save();

  await Product.updateMany(
    { collections: collection._id, _id: { $nin: collection.productIds } },
    { $pull: { collections: collection._id } }
  );
  await Product.updateMany(
    { _id: { $in: collection.productIds } },
    { $addToSet: { collections: collection._id } }
  );

  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    data: collection
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  await Product.updateMany(
    { collections: collection._id },
    { $pull: { collections: collection._id } }
  );

  await Collection.findByIdAndDelete(collection._id);

  res.status(200).json({
    success: true,
    message: "Collection deleted successfully"
  });
});
