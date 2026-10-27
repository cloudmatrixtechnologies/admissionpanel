
import crypto from "node:crypto";
import mongoose from "mongoose";

import OTP from "./otpModel.mjs";
import VerificationGrant from "./verificationGrantModel.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

const OTP_TTL_MS = 5 * 60 * 1000;
const GRANT_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const ALLOWED_PURPOSES = new Set([
  "registration",
  "login",
  "mobile_change",
]);

const GRANT_PURPOSES = new Set([
  "registration",
  "mobile_change",
]);

function validateInput(mobile, purpose) {
  if (typeof mobile !== "string" || !mobile.trim()) {
    throw new Error("INVALID_MOBILE");
  }

  if (!ALLOWED_PURPOSES.has(purpose)) {
    throw new Error("INVALID_OTP_PURPOSE");
  }
}

function normalizeAndValidateMobile(mobile, purpose) {
  const normalizedMobile = normalizeMobile(mobile);

  validateInput(normalizedMobile, purpose);

  return normalizedMobile;
}

function getOtpSecret() {
  const secret = process.env.OTP_HMAC_SECRET;

  if (
    typeof secret !== "string" ||
    Buffer.byteLength(secret, "utf8") < 32
  ) {
    throw new Error(
      "OTP_HMAC_SECRET must be configured securely"
    );
  }

  return secret;
}

function createOtpHash(mobile, purpose, otp) {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${mobile}:${purpose}:${otp}`, "utf8")
    .digest("hex");
}

function safeCompareHex(first, second) {
  if (
    typeof first !== "string" ||
    typeof second !== "string" ||
    !/^[a-f0-9]{64}$/i.test(first) ||
    !/^[a-f0-9]{64}$/i.test(second)
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(first, "hex"),
    Buffer.from(second, "hex")
  );
}

function createTokenHash(token) {
  return crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

/**
 * Create an OTP or replace an existing OTP after cooldown.
 *
 * Requires the unique index:
 * { mobile: 1, purpose: 1 }
 */
export async function createOtp(mobile, purpose) {
  mobile = normalizeAndValidateMobile(mobile, purpose);

  const now = new Date();
  const cutoff = new Date(
    now.getTime() - RESEND_COOLDOWN_MS
  );

  const otp = crypto
    .randomInt(0, 1_000_000)
    .toString()
    .padStart(6, "0");

  const otpHash = createOtpHash(mobile, purpose, otp);
  const expiresAt = new Date(
    now.getTime() + OTP_TTL_MS
  );

  // First, try to replace an existing OTP whose resend
  // cooldown has elapsed. Do not use upsert here: an upsert
  // could conflict with the existing unique compound index.
  const updated = await OTP.findOneAndUpdate(
    {
      mobile,
      purpose,
      lastSentAt: { $lte: cutoff },
    },
    {
      $set: {
        otpHash,
        expiresAt,
        lastSentAt: now,
        attempts: 0,
        consumedAt: null,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (updated) {
    return {
      otpForDelivery: otp,
      expiresAt: updated.expiresAt,
      otpRecordId: updated._id,
      otpHash,
    };
  }

  // No eligible record was updated. Attempt to create the
  // first record. If another request creates it concurrently,
  // the unique index rejects this insert and we return cooldown.
  try {
    const created = await OTP.create({
      mobile,
      purpose,
      otpHash,
      expiresAt,
      lastSentAt: now,
      attempts: 0,
      consumedAt: null,
    });

    return {
      otpForDelivery: otp,
      expiresAt: created.expiresAt,
      otpRecordId: created._id,
      otpHash,
    };
  } catch (error) {
    if (error?.code === 11000) {
      throw new Error("OTP_RESEND_COOLDOWN");
    }

    throw error;
  }
}

/**
 * Delete only the exact OTP whose SMS delivery failed.
 * A newer OTP with a different hash will not be deleted.
 */
export async function discardUndeliveredOtp({
  otpRecordId,
  otpHash,
}) {
  if (
    !otpRecordId ||
    typeof otpHash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(otpHash)
  ) {
    throw new Error("INVALID_OTP_CLEANUP_INPUT");
  }

  await OTP.deleteOne({
    _id: otpRecordId,
    otpHash,
    consumedAt: null,
  });
}

/**
 * Verify a six-digit OTP.
 *
 * Registration and mobile-change verification issue a
 * verification grant. Login verification does not.
 */
export async function verifyOtp(
  mobile,
  purpose,
  submittedOtp
) {
  mobile = normalizeAndValidateMobile(mobile, purpose);

  if (
    typeof submittedOtp !== "string" ||
    !/^\d{6}$/.test(submittedOtp)
  ) {
    return {
      verified: false,
      reason: "INVALID_OR_EXPIRED",
    };
  }

  const now = new Date();

  // Atomically claim one attempt.
  const record = await OTP.findOneAndUpdate(
    {
      mobile,
      purpose,
      consumedAt: null,
      expiresAt: { $gt: now },
      attempts: { $lt: MAX_ATTEMPTS },
    },
    {
      $inc: { attempts: 1 },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).select("+otpHash");

  if (!record) {
    return {
      verified: false,
      reason: "INVALID_OR_EXPIRED",
    };
  }

  const submittedHash = createOtpHash(
    mobile,
    purpose,
    submittedOtp
  );

  const isValid = safeCompareHex(
    record.otpHash,
    submittedHash
  );

  if (!isValid) {
    if (record.attempts >= MAX_ATTEMPTS) {
      // Delete only the OTP version we checked.
      await OTP.deleteOne({
        _id: record._id,
        mobile,
        purpose,
        otpHash: record.otpHash,
        consumedAt: null,
        attempts: { $gte: MAX_ATTEMPTS },
      });

      return {
        verified: false,
        reason: "TOO_MANY_ATTEMPTS",
      };
    }

    return {
      verified: false,
      reason: "INVALID_OR_EXPIRED",
    };
  }

  // Login OTPs are single-use and never create registration
  // verification grants.
  if (!GRANT_PURPOSES.has(purpose)) {
    const consumed = await OTP.findOneAndDelete({
      _id: record._id,
      mobile,
      purpose,
      otpHash: record.otpHash,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    });

    return {
      verified: Boolean(consumed),
      reason: consumed ? undefined : "INVALID_OR_EXPIRED",
    };
  }

  const verificationToken = crypto
    .randomBytes(32)
    .toString("base64url");

  const tokenHash = createTokenHash(verificationToken);
  const grantExpiresAt = new Date(
    Date.now() + GRANT_TTL_MS
  );

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Consume the exact OTP being verified. If another
      // request already consumed or replaced it, abort.
      const consumed = await OTP.findOneAndDelete(
        {
          _id: record._id,
          mobile,
          purpose,
          otpHash: record.otpHash,
          consumedAt: null,
          expiresAt: { $gt: new Date() },
        },
        { session }
      );

      if (!consumed) {
        throw new Error("OTP_INVALID_OR_EXPIRED");
      }

      // Create the grant in the same transaction.
      await VerificationGrant.create(
        [
          {
            mobile,
            purpose,
            tokenHash,
            expiresAt: grantExpiresAt,
            consumedAt: null,
          },
        ],
        { session }
      );
    });

    return {
      verified: true,
      verificationToken,
      expiresAt: grantExpiresAt,
    };
  } catch (error) {
    if (error.message === "OTP_INVALID_OR_EXPIRED") {
      return {
        verified: false,
        reason: "INVALID_OR_EXPIRED",
      };
    }

    throw error;
  } finally {
    await session.endSession();
  }
}
