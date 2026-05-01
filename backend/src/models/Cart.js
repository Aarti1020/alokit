import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
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
      default: ""
    },
    productSlug: {
      type: String,
      default: ""
    },
    featuredImage: {
      type: String,
      default: ""
    },
    selectedVariant: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    _id: true,
    timestamps: false
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

cartItemSchema.pre("validate", function (next) {
  if (!this.productId && this.product) {
    this.productId = this.product;
  }

  if (!this.product && this.productId) {
    this.product = this.productId;
  }

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
