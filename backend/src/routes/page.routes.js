import express from "express";
import {
  createPage,
  deletePage,
  getAdminPageById,
  getAdminPages,
  getFooterNavigationPages,
  getHeaderNavigationPages,
  getPageBySlug,
  getPages,
  updatePage
} from "../controllers/page.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createPageValidator,
  pageIdParamValidator,
  pageSlugParamValidator,
  updatePageValidator
} from "../validators/page.validator.js";

const router = express.Router();

router.get("/pages/navigation/header", getHeaderNavigationPages);
router.get("/pages/navigation/footer", getFooterNavigationPages);
router.get("/pages/:slug", pageSlugParamValidator, validate, getPageBySlug);
router.get("/pages", getPages);

router.get(
  "/admin/pages/:id",
  protect,
  authorize("admin", "superAdmin"),
  pageIdParamValidator,
  validate,
  getAdminPageById
);
router.get("/admin/pages", protect, authorize("admin", "superAdmin"), getAdminPages);
router.post(
  "/admin/pages",
  protect,
  authorize("admin", "superAdmin"),
  createPageValidator,
  validate,
  createPage
);
router.put(
  "/admin/pages/:id",
  protect,
  authorize("admin", "superAdmin"),
  updatePageValidator,
  validate,
  updatePage
);
router.delete(
  "/admin/pages/:id",
  protect,
  authorize("admin", "superAdmin"),
  pageIdParamValidator,
  validate,
  deletePage
);

export default router;
