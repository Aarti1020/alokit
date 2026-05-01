import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory
} from "../controllers/subcategory.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
  createSubCategoryValidator,
  subCategoryIdParamValidator,
  updateSubCategoryValidator
} from "../validators/subcategory.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getAllSubCategories);
router.get("/:id", subCategoryIdParamValidator, validate, getSubCategoryById);

router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  createSubCategoryValidator,
  validate,
  createSubCategory
);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateSubCategoryValidator,
  validate,
  updateSubCategory
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  subCategoryIdParamValidator,
  validate,
  deleteSubCategory
);

export default router;
