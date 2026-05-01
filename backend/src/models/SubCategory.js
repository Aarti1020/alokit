import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

subCategorySchema.index({ name: 1, category: 1 }, { unique: true });
subCategorySchema.index({ slug: 1, category: 1 }, { unique: true });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;