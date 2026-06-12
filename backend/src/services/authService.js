import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  otpEmailTemplate,
  resetSuccessEmailTemplate,
} from "../utils/emailTemplates.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare plain password with hash
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * User signup
 */
export const signupService = async ({
  name,
  email,
  password,
}) => {
  const existingUser = await User.findOne({
    email,
  });

  // Block verified users
  if (existingUser?.isVerified) {
    throw new Error("Email already registered");
  }

  // Remove old unverified account
  if (existingUser && !existingUser.isVerified) {
    await User.findByIdAndDelete(
      existingUser._id
    );
  }

  const passwordHash = await hashPassword(
    password
  );

  const otp = generateOTP();

  const otpExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  const user = await User.create({
    name,
    email,
    passwordHash,
    authProvider: "local",
    isVerified: false,
    otp,
    otpExpiry,
  });

  try {
    await sendEmail(
      email,
      "Verify Your NexHire Account",
      otpEmailTemplate(
        otp,
        "verify your account"
      )
    );

    return user;
  } catch (error) {
    // Remove user if email sending fails
    await User.findByIdAndDelete(user._id);

    throw new Error(
      "Failed to send OTP email. Please try again."
    );
  }
};

/**
 * Verify email OTP
 */
export const verifyOTPService = async ({
  email,
  otp,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (!user.otpExpiry || new Date() > user.otpExpiry) {
    throw new Error("OTP expired");
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return user;
};

/**
 * Resend verification OTP
 */
export const resendOTPService = async ({
  email,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  await sendEmail(
    email,
    "Verify Your NexHire Account",
    otpEmailTemplate(otp, "verify your account")
  );

  return user;
};

/**
 * User login
 */
export const loginService = async ({
  email,
  password,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.authProvider === "google") {
    throw new Error("Please use Google to login");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return {
    token,
    user: userObject,
  };
};

/**
 * Google Authentication
 */
export const googleAuthService = async ({
  googleId,
  email,
  name,
  avatar,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.authProvider === "local") {
      throw new Error(
        "Email already registered with password"
      );
    }

    const token = generateToken(existingUser._id);

    const userObject = existingUser.toObject();
    delete userObject.passwordHash;

    return {
      token,
      user: userObject,
    };
  }

  const user = await User.create({
    name,
    email,
    googleId,
    avatar,
    authProvider: "google",
    isVerified: true,
  });

  const token = generateToken(user._id);

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return {
    token,
    user: userObject,
  };
};

/**
 * Forgot Password
 */
export const forgotPasswordService = async ({
  email,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(
      "No account found with this email"
    );
  }

  if (user.authProvider === "google") {
    throw new Error(
      "This account uses Google login"
    );
  }

  const otp = generateOTP();

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.save();

  await sendEmail(
    email,
    "Reset Your NexHire Password",
    otpEmailTemplate(otp, "reset your password")
  );

  return {
    message: "Password reset OTP sent successfully",
  };
};

/**
 * Verify Password Reset OTP
 */
export const verifyResetOTPService = async ({
  email,
  otp,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.resetPasswordOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    !user.resetPasswordOtpExpiry ||
    new Date() > user.resetPasswordOtpExpiry
  ) {
    throw new Error("OTP expired");
  }

  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiry = null;

  await user.save();

  return {
    resetToken,
  };
};

/**
 * Reset Password
 */
export const resetPasswordService = async ({
  token,
  newPassword,
}) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new Error(
      "Invalid or expired reset token"
    );
  }

  const isSamePassword =
    await comparePassword(
      newPassword,
      user.passwordHash
    );

  if (isSamePassword) {
    throw new Error(
      "New password must be different from current password"
    );
  }

  user.passwordHash = await hashPassword(
    newPassword
  );

  user.resetPasswordToken = null;
  user.resetPasswordTokenExpiry = null;

  await user.save();

  await sendEmail(
    user.email,
    "Password Updated Successfully",
    resetSuccessEmailTemplate()
  );

  return {
    message:
      "Password reset successfully",
  };
};