
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  requestOtp,
  verifyOtpController,
} from "./authController.mjs";

import { registerController } from "./registrationController.mjs";

const router = Router();

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
  },
});

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

router.post("/otp/request", otpRequestLimiter, requestOtp);
router.post("/otp/verify", otpVerifyLimiter, verifyOtpController);
router.post("/register", registrationLimiter, registerController);

export default router;
