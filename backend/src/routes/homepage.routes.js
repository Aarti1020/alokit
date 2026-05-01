import express from "express";
import {
  createHomepageSection,
  deleteHomepageSection,
  getHomepage,
  getHomepageSectionById,
  getHomepageSections,
  updateHomepageSection
} from "../controllers/homepage.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createHomepageSectionValidator,
  homepageSectionIdParamValidator,
  updateHomepageSectionValidator
} from "../validators/homepage.validator.js";

const router = express.Router();

router.get("/homepage", getHomepage);

router.get(
  "/admin/homepage/sections/:id",
  protect,
  authorize("admin", "superAdmin"),
  homepageSectionIdParamValidator,
  validate,
  getHomepageSectionById
);
router.get(
  "/admin/homepage/sections",
  protect,
  authorize("admin", "superAdmin"),
  getHomepageSections
);
router.post(
  "/admin/homepage/sections",
  protect,
  authorize("admin", "superAdmin"),
  createHomepageSectionValidator,
  validate,
  createHomepageSection
);
router.put(
  "/admin/homepage/sections/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateHomepageSectionValidator,
  validate,
  updateHomepageSection
);
router.delete(
  "/admin/homepage/sections/:id",
  protect,
  authorize("admin", "superAdmin"),
  homepageSectionIdParamValidator,
  validate,
  deleteHomepageSection
);

export default router;
