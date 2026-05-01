import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sanitizeObject } from "../utils/sanitizeInput.js";
import { createLead as createLeadService } from "../services/lead.service.js";
import { buildSpamSafeSuccess, hasFilledHoneypot } from "../utils/spamGuard.js";

export const submitContactForm = asyncHandler(async (req, res) => {
  const payload = sanitizeObject(req.body);

  if (hasFilledHoneypot(req.body)) {
    return res.status(202).json(buildSpamSafeSuccess("Contact form submitted successfully"));
  }

  if (payload.product) {
    const product = await Product.findById(payload.product);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }
  }

  const lead = await createLeadService({
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    message: payload.message,
    formType: "contact",
    source: payload.source || "contact_page",
    product: payload.product || null,
    priority: "medium"
  });

  res.status(201).json({
    success: true,
    message: "Contact form submitted successfully",
    data: lead
  });
});
