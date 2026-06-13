import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  validateRoleController,
} from "../controllers/roleController.js";

const router = Router();

/**
 * Validate role
 */
router.post(
  "/validate",
  protect,
  validateRoleController
);

export default router;