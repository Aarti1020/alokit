import mongoose from "mongoose";
import sanitizeHtml from "../utils/sanitizeHtml.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: ""
    },
    module: {
      type: String,
      enum: [
        "general",
        "product",
        "order",
        "shipping",
        "refund",
        "rudraksha",
        "gemstone",
        "homepage",
        "collection"
      ],
      default: "general"
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

faqSchema.index({ module: 1 });
faqSchema.index({ category: 1 });
faqSchema.index({ status: 1 });
faqSchema.index({ sortOrder: 1 });
faqSchema.index({ entityId: 1 });

faqSchema.pre("save", function (next) {
  this.question = sanitizeString(this.question || "");
  this.answer = sanitizeHtml(this.answer || "");
  this.category = sanitizeString(this.category || "");
  next();
});

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
