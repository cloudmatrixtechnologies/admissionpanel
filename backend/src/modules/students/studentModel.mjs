
import mongoose from "mongoose";

const academicSchema = new mongoose.Schema(
  {
    currentClass: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    board: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    passingYear: {
      type: Number,
      min: 1950,
      max: 2100,
    },

    marksPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false, strict: "throw" }
);

const studentSchema = new mongoose.Schema(
  {
    // Every student profile belongs to a parent account.
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    // Null means the student does not yet have a separate login.
    studentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Required during signup in BOTH cases.
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return (
            value instanceof Date &&
            !Number.isNaN(value.getTime()) &&
            value < new Date()
          );
        },
        message: "Date of birth must be a valid past date.",
      },
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    religion: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    caste: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    community: {
      type: String,
      enum: ["OC", "BC", "MBC", "SC", "ST"],
    },

    motherTongue: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    academic: {
      type: academicSchema,
      default: () => ({}),
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

studentSchema.index({ parentUser: 1, createdAt: -1 });

// Prevent one student login from being linked to multiple profiles.
studentSchema.index(
  { studentUser: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentUser: { $type: "objectId" },
    },
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
