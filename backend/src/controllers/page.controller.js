import Page from "../models/Page.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import makeSlug from "../utils/slugify.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

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

const assignPageFields = (page, payload, userId) => {
  if (payload.title !== undefined) {
    page.title = sanitizeString(payload.title);

    if (payload.slug === undefined) {
      page.slug = makeSlug(payload.title);
    }
  }
  if (payload.slug !== undefined) page.slug = makeSlug(payload.slug);
  if (payload.pageType !== undefined) page.pageType = payload.pageType;
  if (payload.content !== undefined) page.content = payload.content;
  if (payload.status !== undefined) page.status = payload.status;
  if (payload.showInHeader !== undefined) page.showInHeader = payload.showInHeader;
  if (payload.showInFooter !== undefined) page.showInFooter = payload.showInFooter;
  if (payload.seo !== undefined) page.seo = normalizeSeo(payload.seo);
  if (!page.createdBy) page.createdBy = userId;
  page.updatedBy = userId;
};

const ensureUniqueSlug = async (slug, excludedId = null) => {
  const duplicate = await Page.findOne({
    slug,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "Page slug already exists");
  }
};

export const getPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({ status: "published" }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Pages fetched successfully",
    results: pages.length,
    data: pages
  });
});

export const getPageBySlug = asyncHandler(async (req, res) => {
  const page = await Page.findOne({
    slug: req.params.slug,
    status: "published"
  });

  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  res.status(200).json({
    success: true,
    message: "Page fetched successfully",
    data: page
  });
});

export const getHeaderNavigationPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({
    status: "published",
    showInHeader: true
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Header pages fetched successfully",
    results: pages.length,
    data: pages
  });
});

export const getFooterNavigationPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({
    status: "published",
    showInFooter: true
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Footer pages fetched successfully",
    results: pages.length,
    data: pages
  });
});

export const getAdminPages = asyncHandler(async (req, res) => {
  const pages = await Page.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Admin pages fetched successfully",
    results: pages.length,
    data: pages
  });
});

export const getAdminPageById = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);

  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  res.status(200).json({
    success: true,
    message: "Page fetched successfully",
    data: page
  });
});

export const createPage = asyncHandler(async (req, res) => {
  const page = new Page();
  assignPageFields(page, req.body, req.user._id);
  await ensureUniqueSlug(page.slug || makeSlug(page.title || ""));
  await page.save();

  res.status(201).json({
    success: true,
    message: "Page created successfully",
    data: page
  });
});

export const updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findById(req.params.id);

  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  assignPageFields(page, req.body, req.user._id);
  await ensureUniqueSlug(page.slug || makeSlug(page.title || ""), page._id);
  await page.save();

  res.status(200).json({
    success: true,
    message: "Page updated successfully",
    data: page
  });
});

export const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);

  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  res.status(200).json({
    success: true,
    message: "Page deleted successfully"
  });
});
