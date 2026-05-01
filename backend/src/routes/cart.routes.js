 import express from "express";
 import protect from "../middlewares/auth.middleware.js";
 import validate from "../middlewares/validate.middleware.js";
 import {
   addToCart,
   clearCart,
   getCart,
   removeCartItem,
   updateCartItemQuantity
 } from "../controllers/cart.controller.js";
 import {
   addToCartValidator,
   removeCartItemValidator,
   updateCartItemValidator
 } from "../validators/cart.validator.js";

 const router = express.Router();

 router.use(protect);

 router.post("/add", addToCartValidator, validate, addToCart);
 router.get("/", getCart);
 router.patch("/item/:itemId", updateCartItemValidator, validate, updateCartItemQuantity);
 router.delete("/remove/:productId", removeCartItemValidator, validate, removeCartItem);
 router.delete("/clear", clearCart);

 export default router;
