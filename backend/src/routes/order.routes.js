import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  checkout,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller.js";
import {
  adminOrderListValidator,
  checkoutValidator,
  orderIdParamValidator,
  updateOrderStatusValidator
} from "../validators/order.validator.js";

const router = express.Router();

router.use(protect);

router.post("/checkout", checkoutValidator, validate, checkout);
router.get("/my-orders", getMyOrders);
router.get(
  "/",
  authorize("admin", "superAdmin"),
  adminOrderListValidator,
  validate,
  getAllOrders
);
router.get("/:id", orderIdParamValidator, validate, getOrderById);
router.patch(
  "/:id/status",
  authorize("admin", "superAdmin"),
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

export default router;
