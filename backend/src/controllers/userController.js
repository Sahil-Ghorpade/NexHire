import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Interview from "../models/Interview.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

/**
 * Get current logged-in user
 */
export const getMe = async (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const getDashboardStats =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      const [
        totalInterviews,
        interviewScores,
        totalAnalyses,
        atsScores,
      ] = await Promise.all([
        Interview.countDocuments({
          userId,
        }),

        Interview.find(
          { userId },
          {
            overallScore: 1,
          }
        ),

        ResumeAnalysis.countDocuments(
          {
            userId,
          }
        ),

        ResumeAnalysis.find(
          { userId },
          {
            atsScore: 1,
          }
        ),
      ]);

      const avgInterviewScore =
        interviewScores.length
          ? Number(
              (
                interviewScores.reduce(
                  (
                    sum,
                    interview
                  ) =>
                    sum +
                    interview.overallScore,
                  0
                ) /
                interviewScores.length
              ).toFixed(1)
            )
          : 0;

      const avgAtsScore =
        atsScores.length
          ? Number(
              (
                atsScores.reduce(
                  (
                    sum,
                    analysis
                  ) =>
                    sum +
                    analysis.atsScore,
                  0
                ) /
                atsScores.length
              ).toFixed(1)
            )
          : 0;

      return res.status(200).json({
        success: true,
        stats: {
          totalInterviews,
          avgInterviewScore,
          totalAnalyses,
          avgAtsScore,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  export const updateProfile =
  async (req, res) => {
    try {
      const {
        name,
        skills,
        targetRole,
        avatar,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      if (
        name !== undefined
      ) {
        user.name = name;
      }

      if (
        skills !== undefined
      ) {
        user.skills = skills;
      }

      if (
        targetRole !==
        undefined
      ) {
        user.targetRole =
          targetRole;
      }

      if (
        avatar !==
        undefined
      ) {
        user.avatar = avatar;
      }

      await user.save();

      const sanitizedUser =
        user.toObject();

      delete sanitizedUser.passwordHash;

      return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        user: sanitizedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  export const updatePassword =
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      const user =
        await User.findById(
          req.user._id
        ).select(
          "+passwordHash"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      if (
        user.authProvider ===
        "google"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Google accounts cannot change password",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.passwordHash
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      if (
        currentPassword ===
        newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be different",
        });
      }

      user.passwordHash =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  export const deleteAccount =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      await Promise.all([
        Interview.deleteMany({
          userId,
        }),

        ResumeAnalysis.deleteMany(
          {
            userId,
          }
        ),

        User.findByIdAndDelete(
          userId
        ),
      ]);

      return res.status(200).json({
        success: true,
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };