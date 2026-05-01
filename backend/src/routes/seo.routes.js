import express from "express";
import {
  createSeoConfig,
  getAdminSeoConfigById,
  getAdminSeoConfigs,
  getSeoByPageKey,
  updateSeoConfig
} from "../controllers/seo.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createSeoValidator,
  seoIdParamValidator,
  seoPageKeyParamValidator,
  updateSeoValidator
} from "../validators/seo.validator.js";

const router = express.Router();

router.get("/seo/:pageKey", seoPageKeyParamValidator, validate, getSeoByPageKey);

router.get(
  "/admin/seo/:id",
  protect,
  authorize("admin", "superAdmin"),
  seoIdParamValidator,
  validate,
  getAdminSeoConfigById
);
router.get("/admin/seo", protect, authorize("admin", "superAdmin"), getAdminSeoConfigs);
router.post(
  "/admin/seo",
  protect,
  authorize("admin", "superAdmin"),
  createSeoValidator,
  validate,
  createSeoConfig
);
router.put(
  "/admin/seo/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateSeoValidator,
  validate,
  updateSeoConfig
);

export default router;
