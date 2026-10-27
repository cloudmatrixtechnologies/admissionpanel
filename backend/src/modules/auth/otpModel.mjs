
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Store a keyed HMAC of the OTP, never the OTP itself.
    otpHash: {
      type: String,
      required: true,
      select: false,
    },

    purpose: {
      type: String,
      enum: ["registration", "login", "mobile_change"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    consumedAt: {
      type: Date,
      default: null,
    },

    // Used to enforce resend cooldowns.
    lastSentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// Automatically remove expired OTP records.
// This cleanup is asynchronous, so expiry must also be
// checked explicitly by the verification service.
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Supports looking up a verification record for a mobile
// number and purpose.
otpSchema.index(
  { mobile: 1, purpose: 1 },
  { unique: true }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
