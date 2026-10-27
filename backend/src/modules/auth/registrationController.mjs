
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../users/userModel.mjs";
import Student from "../students/studentModel.mjs";

import { registrationSchema } from "./registrationSchema.mjs";
import { consumeVerificationGrant } from "./verificationGrantService.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

export async function registerController(req, res, next) {
  try {
    // 1. Validate the entire request.
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;

    // bcrypt only uses up to 72 UTF-8 bytes of a password.
    if (Buffer.byteLength(data.password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 72 UTF-8 bytes.",
      });
    }

    // 2. Normalize both mobile numbers to international format.
    let studentMobile;
    let guardianMobile;

    try {
      studentMobile = normalizeMobile(
        data.mobile_number,
        data.mobile_country
      );

      guardianMobile = normalizeMobile(
        data.guardian_mobile,
        data.guardian_country
      );
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number or country selection.",
      });
    }

    const sameNumber = studentMobile === guardianMobile;

    // 3. If the numbers differ, both must be verified.
    if (
      !sameNumber &&
      !data.guardian_verification_token
    ) {
      return res.status(400).json({
        success: false,
        message: "Parent mobile verification is required.",
      });
    }

    const studentDob = new Date(`${data.dob}T00:00:00.000Z`);

    // 4. Hash passwords before saving them.
    const parentPasswordHash = await bcrypt.hash(data.password, 12);

    // No separate student login when both numbers are the same.
    const studentPasswordHash = sameNumber
      ? null
      : await bcrypt.hash(data.password, 12);

    const session = await mongoose.startSession();
    let responseData;

    try {
      await session.withTransaction(async () => {
        // 5. Consume the student/contact mobile verification grant.
        await consumeVerificationGrant({
          mobile: studentMobile,
          purpose: "registration",
          token: data.mobile_verification_token,
          session,
        });

        // 6. Consume the parent grant only when the numbers differ.
        if (!sameNumber) {
          await consumeVerificationGrant({
            mobile: guardianMobile,
            purpose: "registration",
            token: data.guardian_verification_token,
            session,
          });
        }

        // 7. Prevent creating accounts for existing mobile numbers.
        const mobileNumbers = sameNumber
          ? [guardianMobile]
          : [studentMobile, guardianMobile];

        const existingUsers = await User.find({
          mobile_number: { $in: mobileNumbers },
        })
          .select("mobile_number")
          .session(session)
          .lean();

        if (existingUsers.length > 0) {
          const error = new Error("ACCOUNT_ALREADY_EXISTS");
          throw error;
        }

        const verifiedAt = new Date();

        // 8. Create the parent account.
        // Parent's name and full details are collected later.
        const parentUser = new User({
          mobile_number: guardianMobile,
          role: "parent",
          password_hash: parentPasswordHash,
          mobile_verified_at: verifiedAt,
          status: "active",
        });

        await parentUser.save({ session });

        let studentUser = null;

        // 9. Create a separate student login only when A != B.
        if (!sameNumber) {
          studentUser = new User({
            mobile_number: studentMobile,
            full_name: data.full_name,
            role: "student",
            password_hash: studentPasswordHash,
            mobile_verified_at: verifiedAt,
            status: "active",
          });

          await studentUser.save({ session });
        }

        // 10. Create the student profile in both cases.
        const studentProfile = new Student({
          parentUser: parentUser._id,
          studentUser: studentUser?._id ?? null,

          fullName: data.full_name,
          dateOfBirth: studentDob,
          gender: data.gender,
          religion: data.religion,
          caste: data.caste,
          community: data.community,
          motherTongue: data.mother_tongue,
          bloodGroup: data.blood_group,
        });

        await studentProfile.save({ session });

        responseData = {
          success: true,
          message: "Registration completed successfully.",
          account_type: sameNumber
            ? "parent_only"
            : "parent_and_student",
          student_account_created: !sameNumber,
          student_profile_created: true,
        };
      });
    } finally {
      await session.endSession();
    }

    return res.status(201).json(responseData);
  } catch (error) {
    if (error.message === "ACCOUNT_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "An account already exists for one of these mobile numbers.",
      });
    }

    if (error.message === "VERIFICATION_GRANT_INVALID_OR_EXPIRED") {
      return res.status(400).json({
        success: false,
        message: "Mobile verification has expired. Please verify again.",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account already exists for this mobile number.",
      });
    }

    return next(error);
  }
}
