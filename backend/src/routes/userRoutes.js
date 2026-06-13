import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";
import { getMe } from "../controllers/userController.js";

const router = Router();

/**
 * Current User
 */
router.get(
  "/me",
  protect,
  getMe
);

export default router;