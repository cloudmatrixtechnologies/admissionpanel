import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "Backend and database are working"
      : "Backend is running, but database is not connected",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

export default router;