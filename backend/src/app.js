import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS Configuration
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexhire-six.vercel.app",
];

const corsOptions = {
  origin: (
    origin,
    callback
  ) => {
    // Allow requests from Postman,
    // Thunder Client, mobile apps, etc.
    if (!origin) {
      return callback(
        null,
        true
      );
    }

    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      return callback(
        null,
        true
      );
    }

    return callback(
      new Error(
        "Not allowed by CORS"
      )
    );
  },

  credentials: true,
};

app.use(
  cors(corsOptions)
);

/**
 * Request Logger
 */
app.use(morgan("dev"));

/**
 * Parse JSON Request Body
 */
app.use(express.json());

/**
 * Health Check Route
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "NexHire API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use(
  "/api/interview",
  interviewRoutes
);
app.use(
  "/api/resume",
  resumeRoutes
);

export default app;