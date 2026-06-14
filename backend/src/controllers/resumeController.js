import mongoose from "mongoose";

import ResumeAnalysis from "../models/ResumeAnalysis.js";

import { analyzeResumeService } from "../services/resumeService.js";

import { generateResumePDF } from "../services/pdfService.js";

/**
 * Analyze Resume
 */
export const analyzeResume = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Resume file is required",
      });
    }

    const analysis =
      await analyzeResumeService({
        userId: req.user._id,
        role,
        fileBuffer:
          req.file.buffer,
        mimeType:
          req.file.mimetype,
      });

    return res.status(201).json({
      success: true,
      analysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all analyses
 */
export const getResumeAnalyses =
  async (req, res) => {
    try {
      const analyses =
        await ResumeAnalysis.find({
          userId:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        analyses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/**
 * Get analysis by ID
 */
export const getResumeAnalysisById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid analysis ID",
        });
      }

      const analysis =
        await ResumeAnalysis.findOne(
          {
            _id: id,
            userId:
              req.user._id,
          }
        );

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "Analysis not found",
        });
      }

      return res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/**
 * Delete analysis
 */
export const deleteResumeAnalysis =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid analysis ID",
        });
      }

      const analysis =
        await ResumeAnalysis.findOneAndDelete(
          {
            _id: id,
            userId:
              req.user._id,
          }
        );

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "Analysis not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Analysis deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/**
 * Download Resume Analysis PDF
 */
export const downloadResumePDF =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid analysis ID",
          });
      }

      const analysis =
        await ResumeAnalysis.findOne(
          {
            _id: id,
            userId:
              req.user._id,
          }
        );

      if (!analysis) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Analysis not found",
          });
      }

      const doc =
        generateResumePDF({
          userName:
            req.user.name,
          analysis,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="resume-analysis-${id}.pdf"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error(
        "Download Resume PDF Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to generate resume PDF",
        });
    }
  };