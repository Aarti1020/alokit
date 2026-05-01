import express from "express";
import { submitContactForm } from "../controllers/contact.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { submitContactValidator } from "../validators/contact.validator.js";

const router = express.Router();

router.post("/", submitContactValidator, validate, submitContactForm);

export default router;
