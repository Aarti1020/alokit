import express from "express";
import { submitRudrakshaCalculator } from "../controllers/rudrakshaCalculator.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { submitRudrakshaCalculatorValidator } from "../validators/rudrakshaCalculator.validator.js";

const router = express.Router();

router.post("/submit", submitRudrakshaCalculatorValidator, validate, submitRudrakshaCalculator);

export default router;
