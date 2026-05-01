import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    avatar: {
      public_id: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: ""
      }
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin", "super_admin"],
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: "",
      select: false
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  if (this.role === "super_admin") {
    this.role = "superAdmin";
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 15);

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
