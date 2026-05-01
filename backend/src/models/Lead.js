import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    formType: {
      type: String,
      enum: [
        "contact",
        "consultation",
        "custom_order",
        "bulk_order",
        "callback",
        "gemstone_recommendation",
        "rudraksha_recommendation"
      ],
      default: "contact"
    },
    source: {
      type: String,
      default: "",
      trim: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "closed", "spam"],
      default: "new"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    notes: {
      type: [String],
      default: []
    },
    isSpam: {
      type: Boolean,
      default: false
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    contactedAt: {
      type: Date,
      default: null
    },
    convertedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
