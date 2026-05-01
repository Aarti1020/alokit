import { body } from "express-validator";
import { normalizeDate } from "../utils/rudrakshaCalculator.js";

export const submitRudrakshaCalculatorValidator = [
  body("suggestionBy")
    .trim()
    .notEmpty()
    .withMessage("Suggestion type is required")
    .isIn(["BIRTH", "MANIFESTATION_LUCK", "PURPOSE"])
    .withMessage("Suggestion type is invalid"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 80 })
    .withMessage("Name must be at most 80 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
  body("dateOfBirth")
    .trim()
    .notEmpty()
    .withMessage("Date of birth is required")
    .custom((value) => {
      normalizeDate(value);
      return true;
    }),
  body("birthTime")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Birth time must use HH:mm format"),
  body("placeOfBirth")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Place of birth must be at most 120 characters")
];
