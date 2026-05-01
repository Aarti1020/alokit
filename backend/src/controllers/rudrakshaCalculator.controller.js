import asyncHandler from "../utils/asyncHandler.js";
import { submitRudrakshaCalculator as submitRudrakshaCalculatorService } from "../services/rudrakshaCalculator.service.js";

export const submitRudrakshaCalculator = asyncHandler(async (req, res) => {
  const result = await submitRudrakshaCalculatorService(req.body);

  res.status(201).json({
    success: true,
    message: "Rudraksha recommendation calculated successfully",
    data: result
  });
});
