import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  generateQuestions,
  evaluateInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
  downloadInterviewPDF,
} from "../controllers/interviewController.js";

const router = Router();

/**
 * All routes protected
 */
router.post(
  "/generate-questions",
  protect,
  generateQuestions
);

router.post(
  "/evaluate",
  protect,
  evaluateInterview
);

router.get(
  "/",
  protect,
  getInterviews
);

router.get(
  "/:id",
  protect,
  getInterviewById
);

router.get(
  "/:id/download",
  protect,
  downloadInterviewPDF
);

router.delete(
  "/:id",
  protect,
  deleteInterview
);

export default router;