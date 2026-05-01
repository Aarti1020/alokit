import express from "express";
import {
  addLeadNote,
  createLead,
  createGemstoneRecommendationLead,
  createRudrakshaRecommendationLead,
  getAllLeads,
  getLeadDetails,
  updateLeadStatus
} from "../controllers/lead.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  addLeadNoteValidator,
  createLeadValidator,
  leadIdValidator,
  leadListValidator,
  updateLeadStatusValidator
} from "../validators/lead.validator.js";

const router = express.Router();

router.post("/", createLeadValidator, validate, createLead);
router.post(
  "/gemstone-recommendation",
  createLeadValidator,
  validate,
  createGemstoneRecommendationLead
);
router.post(
  "/rudraksha-recommendation",
  createLeadValidator,
  validate,
  createRudrakshaRecommendationLead
);

router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  leadListValidator,
  validate,
  getAllLeads
);
router.get(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  leadIdValidator,
  validate,
  getLeadDetails
);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superAdmin"),
  updateLeadStatusValidator,
  validate,
  updateLeadStatus
);
router.post(
  "/:id/note",
  protect,
  authorize("admin", "superAdmin"),
  addLeadNoteValidator,
  validate,
  addLeadNote
);

export default router;
