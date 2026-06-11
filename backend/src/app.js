import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * Enable CORS
 * Allow all origins for now
 */
app.use(cors());

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

export default app;