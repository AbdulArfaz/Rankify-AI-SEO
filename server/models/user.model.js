import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },
    analysisCount: {
      type: Number,
      default: 0
    },
    lastAnalysisDate: {
      type: Date,
      default: null
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.USER_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.USER_REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.models.user || mongoose.model("User", userSchema);