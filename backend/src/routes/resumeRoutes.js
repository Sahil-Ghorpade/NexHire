import { Router } from "express";
import multer from "multer";

import { protect } from "../middleware/authMiddleware.js";

import {
  analyzeResume,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
} from "../controllers/resumeController.js";

const router = Router();

/**
 * Memory storage
 */
const storage =
  multer.memoryStorage();

/**
 * File filter
 */
const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only PDF and DOCX files are allowed"
    ),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

/**
 * Upload middleware with error handling
 */
const uploadResume = (
  req,
  res,
  next
) => {
  upload.single("resume")(
    req,
    res,
    (error) => {
      if (error) {
        if (
          error.code ===
          "LIMIT_FILE_SIZE"
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                "File size must be less than 5MB",
            });
        }

        return res
          .status(400)
          .json({
            success: false,
            message:
              error.message,
          });
      }

      next();
    }
  );
};

/**
 * Routes
 */
router.post(
  "/analyze",
  protect,
  uploadResume,
  analyzeResume
);

router.get(
  "/",
  protect,
  getResumeAnalyses
);

router.get(
  "/:id",
  protect,
  getResumeAnalysisById
);

router.delete(
  "/:id",
  protect,
  deleteResumeAnalysis
);

export default router;