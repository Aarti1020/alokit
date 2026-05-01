import mongoose from "mongoose";
import { sanitizeString } from "../utils/sanitizeInput.js";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      default: "",
      trim: true
    },
    source: {
      type: String,
      default: "website",
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active"
    }
  },
  { timestamps: true }
);

newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });

newsletterSchema.pre("save", function (next) {
  this.email = sanitizeString(this.email || "").toLowerCase();
  this.name = sanitizeString(this.name || "");
  this.source = sanitizeString(this.source || "website");
  next();
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
