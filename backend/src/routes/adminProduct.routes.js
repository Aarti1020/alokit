import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  getAdminProducts,
  replaceAdminProductImages,
  updateAdminProduct,
  updateAdminProductFeatured,
  updateAdminProductStatus,
  updateAdminProductStock
} from "../controllers/adminProduct.controller.js";
import {
  createAdminProductValidator,
  productIdParamValidator,
  replaceProductImagesValidator,
  updateProductValidator
} from "../validators/product.validator.js";
import { body } from "express-validator";
import {
  parseMultipartFields,
  uploadProductImages,
  uploadProductMedia
} from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin", "superAdmin"));

router.get("/", getAdminProducts);
router.get("/:id", productIdParamValidator, validate, getAdminProductById);
router.post(
  "/",
  uploadProductMedia,
  parseMultipartFields([
    "collections",
    "tags",
    "galleryImages",
    "images",
    "variants",
    "seo",
    "specifications",
    "imageAlts"
  ]),
  createAdminProductValidator,
  validate,
  createAdminProduct
);
router.patch(
  "/:id",
  uploadProductMedia,
  parseMultipartFields([
    "collections",
    "tags",
    "galleryImages",
    "images",
    "variants",
    "seo",
    "specifications",
    "imageAlts"
  ]),
  updateProductValidator,
  validate,
  updateAdminProduct
);
router.delete("/:id", productIdParamValidator, validate, deleteAdminProduct);
router.patch(
  "/:id/stock",
  [
    ...productIdParamValidator,
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("lowStockThreshold")
      .optional()
      .isInt({ min: 0 })
      .withMessage("lowStockThreshold must be a non-negative integer")
  ],
  validate,
  updateAdminProductStock
);
router.patch(
  "/:id/status",
  [
    ...productIdParamValidator,
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive")
  ],
  validate,
  updateAdminProductStatus
);
router.patch(
  "/:id/featured",
  [
    ...productIdParamValidator,
    body("isFeatured").isBoolean().withMessage("isFeatured must be a boolean")
  ],
  validate,
  updateAdminProductFeatured
);
router.patch(
  "/:id/images",
  uploadProductImages,
  parseMultipartFields(["imageAlts"]),
  replaceProductImagesValidator,
  validate,
  replaceAdminProductImages
);

export default router;
