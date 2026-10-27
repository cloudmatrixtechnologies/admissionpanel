
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Optional during basic registration.
    // Parent details will be collected during the application stage.
    full_name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Store the normalized mobile number, such as +919876543210.
    mobile_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
    },

    // Always assigned and validated by the backend.
    role: {
      type: String,
      required: true,
      enum: [
        "parent",
        "student",
        "super_admin",
        "manager_admin",
        "telecaller",
        "college_admin",
        "consultation_admin",
      ],
      immutable: true,
    },

    // Never store plaintext passwords.
    password_hash: {
      type: String,
      required: true,
      select: false,
    },

    mobile_verified_at: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },

    password_changed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

const User = mongoose.model("User", userSchema);

export default User;
