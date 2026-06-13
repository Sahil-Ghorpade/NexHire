import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  getMe,
  getDashboardStats,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = Router();

/**
 * Current User
 */
router.get(
  "/me",
  protect,
  getMe
);

router.get(
  "/dashboard",
  protect,
  getDashboardStats
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/password",
  protect,
  updatePassword
);

router.delete(
  "/account",
  protect,
  deleteAccount
);

export default router;