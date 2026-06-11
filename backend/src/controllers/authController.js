import {
  signupService,
  verifyOTPService,
  resendOTPService,
  loginService,
  googleAuthService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
} from "../services/authService.js";

/**
 * User Signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await signupService({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message:
        "OTP sent to your email. Please verify your account.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Verify Email OTP
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    await verifyOTPService({
      email,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    await resendOTPService({ email });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * User Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } =
      await loginService({
        email,
        password,
      });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Google Authentication
 */
export const googleAuth = async (req, res) => {
  try {
    const {
      googleId,
      email,
      name,
      avatar,
    } = req.body;

    const { token, user } =
      await googleAuthService({
        googleId,
        email,
        name,
        avatar,
      });

    return res.status(200).json({
      success: true,
      message:
        "Google authentication successful.",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    await forgotPasswordService({
      email,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset OTP sent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Verify Reset Password OTP
 */
export const verifyResetOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    const { resetToken } =
      await verifyResetOTPService({
        email,
        otp,
      });

    return res.status(200).json({
      success: true,
      message: "OTP verified.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token, newPassword } =
      req.body;

    await resetPasswordService({
      token,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};