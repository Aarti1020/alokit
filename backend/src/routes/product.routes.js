import express from "express";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  replaceProductImages,
  updateProduct
} from "../controllers/product.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
  createProductValidator,
  productIdParamValidator,
  productListValidator,
  productSlugParamValidator,
  replaceProductImagesValidator,
  updateProductValidator
} from "../validators/product.validator.js";
import validate from "../middlewares/validate.middleware.js";
import {
  parseMultipartFields,
  uploadProductImages,
  uploadProductMedia
} from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * Admin listing route must stay ABOVE dynamic slug routes.
 * Otherwise `/admin/list` could be captured by `/:slug`.
 */
router.get(
  "/admin/list",
  protect,
  authorize("admin", "superAdmin"),
  productListValidator,
  validate,
  getAdminProducts
);

router.get("/", productListValidator, validate, getAllProducts);
router.get("/:slug/related", productSlugParamValidator, validate, getRelatedProducts);
router.get("/:slug", productSlugParamValidator, validate, getProductBySlug);

router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
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
  createProductValidator,
  validate,
  createProduct
);

router.patch(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
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
  updateProduct
);

router.put(
  "/:id/images",
  protect,
  authorize("admin", "superAdmin"),
  uploadProductImages,
  parseMultipartFields(["imageAlts"]),
  replaceProductImagesValidator,
  validate,
  replaceProductImages
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  productIdParamValidator,
  validate,
  deleteProduct
);

export default router;
