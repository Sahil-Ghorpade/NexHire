import mongoose from "mongoose";

import Interview from "../models/Interview.js";

import {
  generateQuestionsService,
  evaluateInterviewService,
} from "../services/interviewService.js";

/**
 * Generate interview questions
 */
export const generateQuestions = async (
  req,
  res
) => {
  try {
    const {
      type,
      role,
      difficulty,
      count,
    } = req.body;

    if (
      !type ||
      !role ||
      !difficulty ||
      count === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    if (
      typeof count !== "number" ||
      count < 5 ||
      count > 15
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Count must be between 5 and 15",
      });
    }

    const questions =
      await generateQuestionsService({
        userId: req.user._id,
        type,
        role,
        difficulty,
        count,
      });

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Evaluate interview
 */
export const evaluateInterview = async (
  req,
  res
) => {
  try {
    const {
      type,
      role,
      difficulty,
      questions,
    } = req.body;

    if (
      !type ||
      !role ||
      !difficulty ||
      !Array.isArray(
        questions
      ) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview data",
      });
    }

    const interview =
      await evaluateInterviewService({
        userId: req.user._id,
        type,
        role,
        difficulty,
        questions,
      });

    return res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all interviews
 */
export const getInterviews = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get interview by ID
 */
export const getInterviewById =
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
            "Invalid interview ID",
        });
      }

      const interview =
        await Interview.findOne({
          _id: id,
          userId: req.user._id,
        });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      return res.status(200).json({
        success: true,
        interview,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/**
 * Delete interview
 */
export const deleteInterview =
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
            "Invalid interview ID",
        });
      }

      const interview =
        await Interview.findOneAndDelete(
          {
            _id: id,
            userId:
              req.user._id,
          }
        );

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Interview deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };