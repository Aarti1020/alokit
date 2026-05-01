import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { getRequestBaseUrl } from "../utils/assetUrl.js";
import {
  createProduct,
  deleteProduct,
  replaceProductImages,
  serializeProduct,
  updateProduct
} from "./product.controller.js";

export const createAdminProduct = asyncHandler(async (req, res, next) =>
  createProduct(req, res, next)
);

export const updateAdminProduct = asyncHandler(async (req, res, next) =>
  updateProduct(req, res, next)
);

export const replaceAdminProductImages = asyncHandler(async (req, res, next) =>
  replaceProductImages(req, res, next)
);

export const deleteAdminProduct = asyncHandler(async (req, res, next) =>
  deleteProduct(req, res, next)
);

export const getAdminProducts = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.includeDeleted !== "true") {
    filter.isDeleted = false;
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { title: { $regex: req.query.search, $options: "i" } },
      { sku: { $regex: req.query.search, $options: "i" } }
    ];
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("subCategory", "name slug category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Admin products fetched successfully",
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    data: products.map((product) => serializeProduct(product, { baseUrl }))
  });
});

export const getAdminProductById = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate("subCategory", "name slug category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Admin product fetched successfully",
    data: serializeProduct(product, { baseUrl })
  });
});

export const updateAdminProductStock = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.stock = Number(req.body.stock);
  if (req.body.lowStockThreshold !== undefined) {
    product.lowStockThreshold = Number(req.body.lowStockThreshold);
  }
  product.updatedBy = req.user?._id || product.updatedBy || null;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product stock updated successfully",
    data: serializeProduct(product, { baseUrl })
  });
});

export const updateAdminProductStatus = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.status = req.body.status;
  product.updatedBy = req.user?._id || product.updatedBy || null;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product status updated successfully",
    data: serializeProduct(product, { baseUrl })
  });
});

export const updateAdminProductFeatured = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isFeatured = Boolean(req.body.isFeatured);
  product.updatedBy = req.user?._id || product.updatedBy || null;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product featured flag updated successfully",
    data: serializeProduct(product, { baseUrl })
  });
});
