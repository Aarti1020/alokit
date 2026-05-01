import express from "express";
import {
  createFaq,
  deleteFaq,
  getAdminFaqById,
  getAdminFaqs,
  getFaqs,
  updateFaq
} from "../controllers/faq.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createFaqValidator,
  faqIdParamValidator,
  publicFaqListValidator,
  updateFaqValidator
} from "../validators/faq.validator.js";

const router = express.Router();

router.get("/faqs", publicFaqListValidator, validate, getFaqs);

router.get(
  "/admin/faqs/:id",
  protect,
  authorize("admin", "superAdmin"),
  faqIdParamValidator,
  validate,
  getAdminFaqById
);
router.get("/admin/faqs", protect, authorize("admin", "superAdmin"), getAdminFaqs);
router.post(
  "/admin/faqs",
  protect,
  authorize("admin", "superAdmin"),
  createFaqValidator,
  validate,
  createFaq
);
router.put(
  "/admin/faqs/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateFaqValidator,
  validate,
  updateFaq
);
router.delete(
  "/admin/faqs/:id",
  protect,
  authorize("admin", "superAdmin"),
  faqIdParamValidator,
  validate,
  deleteFaq
);

export default router;
