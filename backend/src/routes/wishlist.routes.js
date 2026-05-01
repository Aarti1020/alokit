import express from "express";
import protect from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist
} from "../controllers/wishlist.controller.js";
import {
  addToWishlistValidator,
  removeFromWishlistValidator
} from "../validators/wishlist.validator.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/add", addToWishlistValidator, validate, addToWishlist);
router.delete("/remove/:productId", removeFromWishlistValidator, validate, removeFromWishlist);
router.delete("/clear", clearWishlist);

export default router;
