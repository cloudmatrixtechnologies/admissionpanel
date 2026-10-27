
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./modules/auth/authRoutes.mjs";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(helmet());

// CORS: allow only configured frontend origins.
const allowedOrigins = (
  process.env.FRONTEND_URLS || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include server-to-server
      // requests and command-line tools.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);

// Limit request body sizes to reduce resource-exhaustion risk.
app.use(express.json({ limit: "20kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(cookieParser());

// General API rate limit. Authentication routes will need
// stricter, separate limits later.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Basic API response.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admission Panel API is running",
  });
});

// Health check reports the real Mongoose connection state.
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: "Admission Panel API health check",
    database: databaseConnected ? "connected" : "disconnected",
  });
});
app.use("/api/auth", authRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handler.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large",
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  // Log details on the server, not in the public response.
console.error("Request error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


const PORT = Number(process.env.PORT) || 8000;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Allow in-flight requests to finish during shutdown.
    const shutdown = (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          await mongoose.disconnect();
          console.log("Database disconnected. Shutdown complete.");
          process.exit(0);
        } catch (error) {
          console.error("Shutdown failed:", error.message);
          process.exit(1);
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
