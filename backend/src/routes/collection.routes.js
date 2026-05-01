import express from "express";
import {
  createCollection,
  deleteCollection,
  getAdminCollectionById,
  getAdminCollections,
  getCollectionBySlug,
  getCollectionProducts,
  getCollections,
  updateCollection
} from "../controllers/collection.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  collectionIdParamValidator,
  collectionListValidator,
  collectionProductListValidator,
  collectionSlugParamValidator,
  createCollectionValidator,
  updateCollectionValidator
} from "../validators/collection.validator.js";

const router = express.Router();

router.get("/collections/:slug/products", collectionProductListValidator, validate, getCollectionProducts);
router.get("/collections/:slug", collectionSlugParamValidator, validate, getCollectionBySlug);
router.get("/collections", collectionListValidator, validate, getCollections);

router.get(
  "/admin/collections/:id",
  protect,
  authorize("admin", "superAdmin"),
  collectionIdParamValidator,
  validate,
  getAdminCollectionById
);
router.get(
  "/admin/collections",
  protect,
  authorize("admin", "superAdmin"),
  collectionListValidator,
  validate,
  getAdminCollections
);
router.post(
  "/admin/collections",
  protect,
  authorize("admin", "superAdmin"),
  createCollectionValidator,
  validate,
  createCollection
);
router.put(
  "/admin/collections/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateCollectionValidator,
  validate,
  updateCollection
);
router.delete(
  "/admin/collections/:id",
  protect,
  authorize("admin", "superAdmin"),
  collectionIdParamValidator,
  validate,
  deleteCollection
);

export default router;
