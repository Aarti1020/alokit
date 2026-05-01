import Lead from "../models/Lead.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildLeadFilterQuery } from "../utils/buildFilterQuery.js";
import getPagination from "../utils/pagination.js";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";
import { buildSpamSafeSuccess, hasFilledHoneypot } from "../utils/spamGuard.js";
import {
  addLeadNote as addLeadNoteService,
  createLead as createLeadService,
  getLeadById as getLeadByIdService,
  getLeads as getLeadsService,
  updateLeadStatus as updateLeadStatusService
} from "../services/lead.service.js";

export const createLead = asyncHandler(async (req, res) => {
  const payload = sanitizeObject(req.body);

  if (hasFilledHoneypot(req.body)) {
    return res.status(202).json(buildSpamSafeSuccess("Lead submitted successfully"));
  }

  if (payload.product) {
    const product = await Product.findById(payload.product);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
  }

  const lead = await createLeadService({
    name: payload.name,
    email: payload.email || "",
    phone: payload.phone || "",
    message: payload.message,
    formType: payload.formType || "contact",
    source: payload.source || "",
    product: payload.product || null,
    priority: payload.priority || "medium"
  });

  res.status(201).json({
    success: true,
    message: "Lead submitted successfully",
    data: lead
  });
});

const createRecommendationLead = (formType, defaultSource) =>
  asyncHandler(async (req, res) => {
    req.body.formType = formType;
    req.body.source = req.body.source || defaultSource;
    return createLead(req, res);
  });

export const createGemstoneRecommendationLead = createRecommendationLead(
  "gemstone_recommendation",
  "product_page"
);

export const createRudrakshaRecommendationLead = createRecommendationLead(
  "rudraksha_recommendation",
  "product_page"
);

export const getAllLeads = asyncHandler(async (req, res) => {
  const filter = buildLeadFilterQuery(req.query);
  const { page, limit, skip } = getPagination(req.query);

  const [leads, total] = await Promise.all([
    getLeadsService(filter, skip, limit),
    Lead.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: "Leads fetched successfully",
    results: leads.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: leads
  });
});

export const getLeadDetails = asyncHandler(async (req, res) => {
  const lead = await getLeadByIdService(req.params.id);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  res.status(200).json({
    success: true,
    message: "Lead fetched successfully",
    data: lead
  });
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const lead = await updateLeadStatusService(
    req.params.id,
    sanitizeString(req.body.status)
  );

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  res.status(200).json({
    success: true,
    message: "Lead status updated successfully",
    data: lead
  });
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const lead = await addLeadNoteService(
    req.params.id,
    sanitizeString(req.body.note)
  );

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  res.status(200).json({
    success: true,
    message: "Lead note added successfully",
    data: lead
  });
});
