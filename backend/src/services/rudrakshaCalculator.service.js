import Product from "../models/Product.js";
import RudrakshaCalculator from "../models/RudrakshaCalculator.js";
import { calculateRudrakshaProfile } from "../utils/rudrakshaCalculator.js";

const productSnapshot = (product) => ({
  id: product._id.toString(),
  name: product.name || "",
  title: product.title || product.name || "",
  slug: product.slug || "",
  productType: product.productType || "",
  shortDescription: product.shortDescription || "",
  price: product.basePrice || 0,
  salePrice: product.salePrice || 0,
  effectivePrice: product.salePrice > 0 ? product.salePrice : product.basePrice || 0,
  image:
    product.primaryImage ||
    product.thumbnail ||
    product.featuredImage ||
    product.galleryImages?.[0] ||
    product.images?.[0]?.url ||
    "",
  inStock: product.inStock ?? product.stock > 0
});

const productSubmissionSnapshot = (product) => ({
  product: product._id,
  name: product.name || "",
  title: product.title || product.name || "",
  slug: product.slug || "",
  productType: product.productType || "",
  price: product.basePrice || 0,
  salePrice: product.salePrice || 0,
  image:
    product.primaryImage ||
    product.thumbnail ||
    product.featuredImage ||
    product.galleryImages?.[0] ||
    product.images?.[0]?.url ||
    ""
});

const findMatchingProducts = async (mukhi) => {
  const mukhiPattern = new RegExp(`\\b${mukhi}\\s*mukhi\\b`, "i");
  const baseQuery = {
    productType: "rudraksha",
    status: { $in: ["active", "published"] },
    isDeleted: { $ne: true }
  };
  const featuredOrHomepageQuery = [{ isFeatured: true }, { showOnHomepage: true }];
  const mukhiMatchQuery = [
    { mukhi },
    { "attributes.mukhi": mukhi },
    { "specifications.mukhi": mukhi },
    { "specifications.mukhi": String(mukhi) },
    { title: mukhiPattern },
    { name: mukhiPattern }
  ];
  const matchingProducts = await Product.find({
    ...baseQuery,
    $and: [{ $or: featuredOrHomepageQuery }, { $or: mukhiMatchQuery }]
  })
    .sort({ showOnHomepage: -1, isFeatured: -1, createdAt: -1 })
    .limit(6)
    .select("name title slug productType shortDescription basePrice salePrice stock inStock thumbnail featuredImage galleryImages images isFeatured showOnHomepage")
    .lean({ virtuals: true });

  if (matchingProducts.length > 0) {
    return matchingProducts;
  }

  return Product.find({
    ...baseQuery,
    $or: featuredOrHomepageQuery
  })
    .sort({ showOnHomepage: -1, isFeatured: -1, createdAt: -1 })
    .limit(6)
    .select("name title slug productType shortDescription basePrice salePrice stock inStock thumbnail featuredImage galleryImages images isFeatured showOnHomepage")
    .lean({ virtuals: true });
};

export const submitRudrakshaCalculator = async (payload) => {
  const { profile, recommendation, normalizedDate } = calculateRudrakshaProfile(payload);

  let products = [];

  try {
    products = await findMatchingProducts(recommendation.mukhi);
  } catch (error) {
    products = [];
  }

  const submission = await RudrakshaCalculator.create({
    suggestionBy: payload.suggestionBy,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    dateOfBirth: normalizedDate,
    birthTime: payload.birthTime || "",
    placeOfBirth: payload.placeOfBirth || "",
    profile,
    recommendation,
    recommendedProducts: products.map(productSubmissionSnapshot)
  });

  return {
    id: submission._id.toString(),
    recommendation,
    profile,
    products: products.map(productSnapshot)
  };
};
