import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    birthNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 9
    },
    zodiacSign: {
      type: String,
      required: true,
      trim: true
    },
    dayOfWeek: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 9
    },
    mukhi: {
      type: Number,
      required: true,
      min: 1,
      max: 9
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const recommendedProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    name: {
      type: String,
      default: "",
      trim: true
    },
    title: {
      type: String,
      default: "",
      trim: true
    },
    slug: {
      type: String,
      default: "",
      trim: true
    },
    productType: {
      type: String,
      default: "",
      trim: true
    },
    price: {
      type: Number,
      default: 0
    },
    salePrice: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: "",
      trim: true
    }
  },
  { _id: false }
);

const rudrakshaCalculatorSchema = new mongoose.Schema(
  {
    suggestionBy: {
      type: String,
      enum: ["BIRTH", "MANIFESTATION_LUCK", "PURPOSE"],
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    dateOfBirth: {
      type: String,
      required: true,
      trim: true
    },
    birthTime: {
      type: String,
      default: "",
      trim: true
    },
    placeOfBirth: {
      type: String,
      default: "",
      trim: true
    },
    profile: {
      type: profileSchema,
      required: true
    },
    recommendation: {
      type: recommendationSchema,
      required: true
    },
    recommendedProducts: {
      type: [recommendedProductSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

rudrakshaCalculatorSchema.index({ createdAt: -1 });
rudrakshaCalculatorSchema.index({ "profile.birthNumber": 1 });
rudrakshaCalculatorSchema.index({ "recommendation.mukhi": 1 });

const RudrakshaCalculator = mongoose.model(
  "RudrakshaCalculator",
  rudrakshaCalculatorSchema
);

export default RudrakshaCalculator;
