import FAQ from "../models/FAQ.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const buildFaqFilter = (query = {}, { admin = false } = {}) => {
  const filter = {};

  if (!admin) {
    filter.status = "active";
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.module) {
    filter.module = query.module;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.entityId) {
    filter.entityId = query.entityId;
  }

  return filter;
};

const assignFaqFields = (faq, payload, userId) => {
  if (payload.question !== undefined) faq.question = sanitizeString(payload.question);
  if (payload.answer !== undefined) faq.answer = payload.answer;
  if (payload.category !== undefined) faq.category = sanitizeString(payload.category);
  if (payload.module !== undefined) faq.module = payload.module;
  if (payload.entityId !== undefined) faq.entityId = payload.entityId || null;
  if (payload.status !== undefined) faq.status = payload.status;
  if (payload.sortOrder !== undefined) faq.sortOrder = payload.sortOrder;
  if (payload.isFeatured !== undefined) faq.isFeatured = payload.isFeatured;
  if (!faq.createdBy) faq.createdBy = userId;
  faq.updatedBy = userId;
};

export const getFaqs = asyncHandler(async (req, res) => {
  const filter = buildFaqFilter(req.query);
  const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "FAQs fetched successfully",
    results: faqs.length,
    data: faqs
  });
});

export const getAdminFaqs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find(buildFaqFilter(req.query, { admin: true })).sort({
    sortOrder: 1,
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    message: "Admin FAQs fetched successfully",
    results: faqs.length,
    data: faqs
  });
});

export const getAdminFaqById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  res.status(200).json({
    success: true,
    message: "FAQ fetched successfully",
    data: faq
  });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = new FAQ();
  assignFaqFields(faq, req.body, req.user._id);
  await faq.save();

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    data: faq
  });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  assignFaqFields(faq, req.body, req.user._id);
  await faq.save();

  res.status(200).json({
    success: true,
    message: "FAQ updated successfully",
    data: faq
  });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  res.status(200).json({
    success: true,
    message: "FAQ deleted successfully"
  });
});
