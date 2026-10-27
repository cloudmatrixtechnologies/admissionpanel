
import { z } from "zod";

// Normalize common mobile-number formatting.
// We will perform country-specific normalization and
// OTP verification in the authentication service.
const mobileSchema = z
  .string()
  .trim()
  .min(8, "Mobile number is too short")
  .max(20, "Mobile number is too long")
  .regex(
    /^\+?[1-9]\d{7,14}$/,
    "Enter a valid mobile number with country code"
  );

// Initial registration data for a parent account.
// The role is intentionally not accepted from public input.
export const parentRegistrationSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    mobile: mobileSchema,
    password: z.string().min(12).max(128),
  })
  .strict();

// Login data.
export const loginSchema = z
  .object({
    mobile: mobileSchema,
    password: z.string().min(1).max(128),
  })
  .strict();

// OTP verification data.
export const verifyOtpSchema = z
  .object({
    mobile: mobileSchema,
    otp: z.string().regex(/^\d{6}$/, "OTP must contain 6 digits"),
  })
  .strict();

// Student profile data.
// The parentUser ID is deliberately excluded: the backend
// must obtain the parent ID from the authenticated session.
export const createStudentSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    dateOfBirth: z.iso.date(),
    gender: z
      .enum(["male", "female", "other", "prefer_not_to_say"])
      .optional(),
    academic: z
      .object({
        currentClass: z.string().trim().max(50).optional(),
        board: z.string().trim().max(100).optional(),
        passingYear: z.number().int().min(1950).max(2100).optional(),
        marksPercentage: z.number().min(0).max(100).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
