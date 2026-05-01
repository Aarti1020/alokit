import SEOConfig from "../models/SEOConfig.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const assignSeoFields = (seoConfig, payload) => {
  if (payload.pageKey !== undefined) seoConfig.pageKey = payload.pageKey;
  if (payload.metaTitle !== undefined) seoConfig.metaTitle = payload.metaTitle;
  if (payload.metaDescription !== undefined) {
    seoConfig.metaDescription = payload.metaDescription;
  }
  if (payload.metaKeywords !== undefined) {
    seoConfig.metaKeywords = Array.isArray(payload.metaKeywords) ? payload.metaKeywords : [];
  }
  if (payload.ogTitle !== undefined) seoConfig.ogTitle = payload.ogTitle;
  if (payload.ogDescription !== undefined) seoConfig.ogDescription = payload.ogDescription;
  if (payload.ogImage !== undefined) seoConfig.ogImage = payload.ogImage;
  if (payload.canonicalUrl !== undefined) seoConfig.canonicalUrl = payload.canonicalUrl;
  if (payload.robots !== undefined) seoConfig.robots = payload.robots;
};

const ensureUniquePageKey = async (pageKey, excludedId = null) => {
  const duplicate = await SEOConfig.findOne({
    pageKey,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "SEO pageKey already exists");
  }
};

export const getSeoByPageKey = asyncHandler(async (req, res) => {
  const seoConfig = await SEOConfig.findOne({ pageKey: req.params.pageKey });

  if (!seoConfig) {
    throw new ApiError(404, "SEO config not found");
  }

  res.status(200).json({
    success: true,
    message: "SEO config fetched successfully",
    data: seoConfig
  });
});

export const getAdminSeoConfigs = asyncHandler(async (req, res) => {
  const seoConfigs = await SEOConfig.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "SEO configs fetched successfully",
    results: seoConfigs.length,
    data: seoConfigs
  });
});

export const getAdminSeoConfigById = asyncHandler(async (req, res) => {
  const seoConfig = await SEOConfig.findById(req.params.id);

  if (!seoConfig) {
    throw new ApiError(404, "SEO config not found");
  }

  res.status(200).json({
    success: true,
    message: "SEO config fetched successfully",
    data: seoConfig
  });
});

export const createSeoConfig = asyncHandler(async (req, res) => {
  const seoConfig = new SEOConfig();
  assignSeoFields(seoConfig, req.body);
  await ensureUniquePageKey(seoConfig.pageKey);
  await seoConfig.save();

  res.status(201).json({
    success: true,
    message: "SEO config created successfully",
    data: seoConfig
  });
});

export const updateSeoConfig = asyncHandler(async (req, res) => {
  const seoConfig = await SEOConfig.findById(req.params.id);

  if (!seoConfig) {
    throw new ApiError(404, "SEO config not found");
  }

  assignSeoFields(seoConfig, req.body);
  await ensureUniquePageKey(seoConfig.pageKey, seoConfig._id);
  await seoConfig.save();

  res.status(200).json({
    success: true,
    message: "SEO config updated successfully",
    data: seoConfig
  });
});
