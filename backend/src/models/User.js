import mongoose from "mongoose";

/**
 * User Schema
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    resetPasswordOtp: {
      type: String,
      default: null,
    },

    resetPasswordOtpExpiry: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    targetRole: {
      type: String,
      default: null,
    },

    recentCustomRoles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;