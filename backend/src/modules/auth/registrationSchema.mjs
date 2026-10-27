
import { z } from "zod";

const mobileSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required.")
  .max(30, "Invalid mobile number.");

const countrySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{2}$/, "Use a valid two-letter country code.")
  .transform((value) => value.toUpperCase())
  .optional();

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(128, "Password is too long.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character.");

const verificationTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43}$/, "Invalid verification token.");

function isValidPastDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date < new Date()
  );
}

export const registrationSchema = z
  .object({
    // Page 1: student/contact mobile.
    mobile_number: mobileSchema,
    mobile_country: countrySchema,

    // Page 2: parent/guardian mobile.
    guardian_mobile: mobileSchema,
    guardian_country: countrySchema,

    // Page 3: student details.
    full_name: z
      .string()
      .trim()
      .min(1, "Student name is required.")
      .max(100, "Student name is too long."),

    dob: z.string().refine(isValidPastDate, {
      message: "Enter a valid date of birth in YYYY-MM-DD format.",
    }),

    gender: z.enum(["male", "female", "other"]).optional(),
    religion: z.string().trim().max(100).optional(),
    caste: z.string().trim().max(100).optional(),
    community: z.enum(["OC", "BC", "MBC", "SC", "ST"]).optional(),
    mother_tongue: z.string().trim().max(100).optional(),

    blood_group: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),

    // Page 4: password.
    password: passwordSchema,
    confirm_password: z.string(),

    // Tokens returned by successful OTP verification.
    mobile_verification_token: verificationTokenSchema,
    guardian_verification_token: verificationTokenSchema.optional(),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.password !== data.confirm_password) {
      context.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "Passwords do not match.",
      });
    }
  });
