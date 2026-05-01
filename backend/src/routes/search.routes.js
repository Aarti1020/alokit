import express from "express";
import validate from "../middlewares/validate.middleware.js";
import { globalSearch, searchSuggestions } from "../controllers/search.controller.js";
import {
  globalSearchValidator,
  searchSuggestionsValidator
} from "../validators/search.validator.js";

const router = express.Router();

router.get("/search", globalSearchValidator, validate, globalSearch);
router.get("/search/suggestions", searchSuggestionsValidator, validate, searchSuggestions);

export default router;
