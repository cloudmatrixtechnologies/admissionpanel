
import mongoose from "mongoose";

const verificationGrantSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },

    purpose: {
      type: String,
      enum: ["registration", "mobile_change"],
      required: true,
      immutable: true,
    },

    // Store only a hash of the random verification token.
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// Automatically clean up expired grants.
// The backend must still check expiresAt explicitly.
verificationGrantSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

verificationGrantSchema.index(
  { tokenHash: 1 },
  { unique: true }
);

const VerificationGrant = mongoose.model(
  "VerificationGrant",
  verificationGrantSchema
);

export default VerificationGrant;
