import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createAdminUser,
  deleteAdminUser,
  blockAdminUser,
  getAdminUserById,
  getAdminUserOrders,
  getAdminUsers,
  resetAdminUserPassword,
  updateAdminUser,
  unblockAdminUser
} from "../controllers/adminUser.controller.js";
import {
  createAdminUserValidator,
  resetAdminUserPasswordValidator,
  updateAdminUserValidator,
  userIdParamValidator
} from "../validators/user.validator.js";

const router = express.Router();

router.use(protect, authorize("admin", "superAdmin"));

router.get("/", getAdminUsers);
router.post("/", createAdminUserValidator, validate, createAdminUser);
router.get("/:id", userIdParamValidator, validate, getAdminUserById);
router.patch("/:id", updateAdminUserValidator, validate, updateAdminUser);
router.patch("/:id/password", resetAdminUserPasswordValidator, validate, resetAdminUserPassword);
router.patch("/:id/block", userIdParamValidator, validate, blockAdminUser);
router.patch("/:id/unblock", userIdParamValidator, validate, unblockAdminUser);
router.delete("/:id", userIdParamValidator, validate, deleteAdminUser);
router.get("/:id/orders", userIdParamValidator, validate, getAdminUserOrders);

export default router;
