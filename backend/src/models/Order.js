import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true
    },
    addressLine2: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false,
    timestamps: false
  }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productSlug: {
      type: String,
      required: true
    },
    featuredImage: {
      type: String,
      default: ""
    },
    selectedVariant: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: ""
    },
    productType: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    categoryName: {
      type: String,
      default: ""
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },
    subCategoryName: {
      type: String,
      default: ""
    },
    origin: {
      type: String,
      default: ""
    },
    shape: {
      type: String,
      default: ""
    },
    style: {
      type: String,
      default: ""
    },
    weightCarat: {
      type: Number,
      default: 0
    },
    weightRatti: {
      type: Number,
      default: 0
    },
    certificationLab: {
      type: String,
      default: ""
    },
    treatment: {
      type: String,
      default: ""
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: true,
    timestamps: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      default: []
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },
      discount: {
        type: Number,
        default: 0,
        min: 0
      },
      shippingCharge: {
        type: Number,
        default: 0,
        min: 0
      },
      tax: {
        type: Number,
        default: 0,
        min: 0
      },
      total: {
        type: Number,
        required: true,
        min: 0
      }
    },
    shippingAddress: {
      type: addressSchema,
      required: true
    },
    billingAddress: {
      type: addressSchema,
      required: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    paymentMethod: {
      type: String,
      default: "razorpay",
      enum: ["razorpay"]
    },
    orderStatus: {
      type: String,
      enum: ["created", "pending", "confirmed", "packed", "processing", "shipped", "delivered", "cancelled"],
      default: "created"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending"
    },
    paymentDetails: {
      razorpayOrderId: {
        type: String,
        default: ""
      },
      razorpayPaymentId: {
        type: String,
        default: ""
      },
      razorpaySignature: {
        type: String,
        default: ""
      },
      verifiedAt: Date
    },
    placedAt: {
      type: Date,
      default: Date.now
    },
    paidAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
