import express from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { subscribeNewsletterValidator } from "../validators/newsletter.validator.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletterValidator, validate, subscribeNewsletter);

export default router;
