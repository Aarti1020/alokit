import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";
import Page from "../models/Page.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";
import asyncHandler from "../utils/asyncHandler.js";
import getPagination from "../utils/pagination.js";
import { getRequestBaseUrl, resolveAssetUrl } from "../utils/assetUrl.js";
import { buildPublicProductFilter } from "./product.controller.js";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeProductSearchResult = (product, baseUrl = "") => ({
  id: product._id,
  title: product.title || product.name,
  slug: product.slug,
  productType: product.productType,
  image: resolveAssetUrl(
    product.featuredImage ||
      product.thumbnail ||
      product.galleryImages?.[0] ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      "",
    baseUrl
  ),
  basePrice: product.basePrice,
  salePrice: product.salePrice,
  emiPrice: product.emiPrice,
  inStock: product.inStock,
  category: product.category,
  subCategory: product.subCategory
});

export const globalSearch = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const searchRegex = new RegExp(escapeRegex(req.query.q), "i");
  const { page, limit, skip } = getPagination(req.query);
  const publicProductFilter = buildPublicProductFilter();

  const productFilter = {
    status: publicProductFilter.status,
    isDeleted: publicProductFilter.isDeleted,
    $and: [
      { $or: publicProductFilter.$or },
      { $or: [
      { name: searchRegex },
      { title: searchRegex },
      { shortDescription: searchRegex },
      { tags: { $elemMatch: { $regex: searchRegex } } }
    ] }
    ]
  };

  const collectionFilter = {
    status: "published",
    $or: [{ title: searchRegex }, { shortDescription: searchRegex }]
  };

  const blogFilter = {
    status: "published",
    $or: [{ title: searchRegex }, { excerpt: searchRegex }, { category: searchRegex }]
  };

  const pageFilter = {
    status: "published",
    $or: [{ title: searchRegex }, { pageType: searchRegex }]
  };

  const categoryFilter = { name: searchRegex };
  const subCategoryFilter = { name: searchRegex };

  const [
    products,
    collections,
    blogs,
    pages,
    categories,
    subCategories,
    productTotal,
    collectionTotal,
    blogTotal,
    pageTotal,
    categoryTotal,
    subCategoryTotal
  ] = await Promise.all([
    Product.find(productFilter)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Collection.find(collectionFilter).sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 }).limit(8),
    Blog.find(blogFilter).sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 }).limit(8),
    Page.find(pageFilter).sort({ showInHeader: -1, showInFooter: -1, createdAt: -1 }).limit(8),
    Category.find(categoryFilter).sort({ createdAt: -1 }).limit(8),
    SubCategory.find(subCategoryFilter).populate("category", "name slug").sort({ createdAt: -1 }).limit(8),
    Product.countDocuments(productFilter),
    Collection.countDocuments(collectionFilter),
    Blog.countDocuments(blogFilter),
    Page.countDocuments(pageFilter),
    Category.countDocuments(categoryFilter),
    SubCategory.countDocuments(subCategoryFilter)
  ]);

  res.status(200).json({
    success: true,
    message: "Search results fetched successfully",
    page,
    limit,
    data: {
      products: products.map((product) => serializeProductSearchResult(product, baseUrl)),
      collections,
      blogs,
      pages,
      categories,
      subCategories
    },
    meta: {
      query: req.query.q,
      products: {
        page,
        limit,
        total: productTotal,
        totalPages: Math.ceil(productTotal / limit) || 1
      },
      collections: { total: collectionTotal },
      blogs: { total: blogTotal },
      pages: { total: pageTotal },
      categories: { total: categoryTotal },
      subCategories: { total: subCategoryTotal }
    }
  });
});

export const searchSuggestions = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const searchRegex = new RegExp(escapeRegex(req.query.q), "i");
  const limit = Number(req.query.limit) || 8;
  const publicProductFilter = buildPublicProductFilter();

  const [products, collections, categories, subCategories] = await Promise.all([
    Product.find({
      status: publicProductFilter.status,
      isDeleted: publicProductFilter.isDeleted,
      $and: [
        { $or: publicProductFilter.$or },
        { $or: [{ name: searchRegex }, { title: searchRegex }] }
      ]
    })
      .select("name title slug featuredImage thumbnail productType")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit),
    Collection.find({
      status: "published",
      title: searchRegex
    })
      .select("title slug heroImage thumbnail")
      .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
      .limit(5),
    Category.find({ name: searchRegex }).select("name slug").limit(5),
    SubCategory.find({ name: searchRegex }).select("name slug").limit(5)
  ]);

  res.status(200).json({
    success: true,
    message: "Search suggestions fetched successfully",
    data: {
      products: products.map((product) => ({
        id: product._id,
        title: product.title || product.name,
        slug: product.slug,
        productType: product.productType,
        image: resolveAssetUrl(
          product.featuredImage || product.thumbnail || product.images?.[0]?.url || "",
          baseUrl
        )
      })),
      collections,
      categories,
      subCategories
    }
  });
});
