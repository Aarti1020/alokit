import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import {
  changeAdminPassword,
  getAdminDashboard,
  getAdminProfile,
  updateAdminAvatar,
  updateAdminProfile
} from "../controllers/admin.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  adminLoginValidator,
  changeAdminPasswordValidator,
  updateAdminProfileValidator
} from "../validators/admin.validator.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory
} from "../controllers/category.controller.js";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  updateSubCategory
} from "../controllers/subcategory.controller.js";
import {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator
} from "../validators/category.validator.js";
import {
  createSubCategoryValidator,
  subCategoryIdParamValidator,
  updateSubCategoryValidator
} from "../validators/subcategory.validator.js";
import adminProductRoutes from "./adminProduct.routes.js";
import adminOrderRoutes from "./adminOrder.routes.js";
import adminUserRoutes from "./adminUser.routes.js";

const router = express.Router();

router.post("/login", adminLoginValidator, validate, loginAdmin);

router.use(protect, authorize("admin", "superAdmin"));

router.get("/profile", getAdminProfile);
router.patch("/profile", updateAdminProfileValidator, validate, updateAdminProfile);
router.patch(
  "/change-password",
  changeAdminPasswordValidator,
  validate,
  changeAdminPassword
);
router.patch("/avatar", uploadSingleImage("avatar"), updateAdminAvatar);
router.get("/dashboard", getAdminDashboard);

router.get("/categories", getAllCategories);
router.post("/categories", createCategoryValidator, validate, createCategory);
router.patch("/categories/:id", updateCategoryValidator, validate, updateCategory);
router.delete("/categories/:id", categoryIdParamValidator, validate, deleteCategory);

router.get("/subcategories", getAllSubCategories);
router.post("/subcategories", createSubCategoryValidator, validate, createSubCategory);
router.patch("/subcategories/:id", updateSubCategoryValidator, validate, updateSubCategory);
router.delete(
  "/subcategories/:id",
  subCategoryIdParamValidator,
  validate,
  deleteSubCategory
);

router.use("/products", adminProductRoutes);
router.use("/orders", adminOrderRoutes);
router.use("/users", adminUserRoutes);

export default router;
