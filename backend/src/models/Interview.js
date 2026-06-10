import mongoose from "mongoose";

/**
 * Question Schema
 */
const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: null,
    },

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/**
 * Learning Path Schema
 */
const learningPathSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
    },

    resource: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

/**
 * Interview Schema
 */
const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Technical", "HR", "Behavioral", "Mixed"],
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    attempted: {
      type: Number,
      required: true,
    },

    skipped: {
      type: Number,
      required: true,
    },

    attemptRate: {
      type: Number,
      required: true,
    },

    overallScore: {
      type: Number,
      required: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weakAreas: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    learningPath: {
      type: [learningPathSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;