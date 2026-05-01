import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory
} from "../controllers/category.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator
} from "../validators/category.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", categoryIdParamValidator, validate, getCategoryById);

router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  createCategoryValidator,
  validate,
  createCategory
);
router.patch(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateCategoryValidator,
  validate,
  updateCategory
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  categoryIdParamValidator,
  validate,
  deleteCategory
);

export default router;
