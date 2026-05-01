import express from "express";
import {
  createBanner,
  deleteBanner,
  getAdminBannerById,
  getAdminBanners,
  getBanners,
  updateBanner
} from "../controllers/banner.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  bannerIdParamValidator,
  createBannerValidator,
  publicBannerListValidator,
  updateBannerValidator
} from "../validators/banner.validator.js";

const router = express.Router();

router.get("/banners", publicBannerListValidator, validate, getBanners);

router.get(
  "/admin/banners/:id",
  protect,
  authorize("admin", "superAdmin"),
  bannerIdParamValidator,
  validate,
  getAdminBannerById
);
router.get("/admin/banners", protect, authorize("admin", "superAdmin"), getAdminBanners);
router.post(
  "/admin/banners",
  protect,
  authorize("admin", "superAdmin"),
  createBannerValidator,
  validate,
  createBanner
);
router.put(
  "/admin/banners/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateBannerValidator,
  validate,
  updateBanner
);
router.delete(
  "/admin/banners/:id",
  protect,
  authorize("admin", "superAdmin"),
  bannerIdParamValidator,
  validate,
  deleteBanner
);

export default router;
