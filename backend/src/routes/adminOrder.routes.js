import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus
} from "../controllers/adminOrder.controller.js";
import {
  adminOrderListValidator,
  orderIdParamValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator
} from "../validators/order.validator.js";

const router = express.Router();

router.use(protect, authorize("admin", "superAdmin"));

router.get("/", adminOrderListValidator, validate, getAdminOrders);
router.get("/:id", orderIdParamValidator, validate, getAdminOrderById);
router.patch("/:id/status", updateOrderStatusValidator, validate, updateAdminOrderStatus);
router.patch(
  "/:id/payment-status",
  updatePaymentStatusValidator,
  validate,
  updateAdminPaymentStatus
);

export default router;
