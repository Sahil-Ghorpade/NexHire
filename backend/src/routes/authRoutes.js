import { Router } from "express";
import { signupValidator, validate } from "../validators/authValidator.js";

import {
  signup,
  verifyOTP,
  resendOTP,
  login,
  googleAuth,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

/**
 * Authentication Routes
 */
router.post("/signup", signupValidator, validate, signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

router.post("/google", googleAuth);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;