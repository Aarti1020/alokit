import Newsletter from "../models/Newsletter.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildSpamSafeSuccess, hasFilledHoneypot } from "../utils/spamGuard.js";

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  if (hasFilledHoneypot(req.body)) {
    return res
      .status(202)
      .json(buildSpamSafeSuccess("Newsletter subscribed successfully"));
  }

  const email = req.body.email.trim().toLowerCase();
  const existingSubscriber = await Newsletter.findOne({ email });

  if (existingSubscriber) {
    if (existingSubscriber.status !== "active") {
      existingSubscriber.status = "active";
      existingSubscriber.name = req.body.name || existingSubscriber.name;
      existingSubscriber.source = req.body.source || existingSubscriber.source;
      await existingSubscriber.save();
    }

    return res.status(200).json({
      success: true,
      message: "Newsletter subscription is already active",
      data: existingSubscriber
    });
  }

  const subscriber = await Newsletter.create({
    email,
    name: req.body.name || "",
    source: req.body.source || "homepage"
  });

  res.status(201).json({
    success: true,
    message: "Newsletter subscribed successfully",
    data: subscriber
  });
});
