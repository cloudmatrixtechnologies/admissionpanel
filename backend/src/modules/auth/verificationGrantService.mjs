
import crypto from "node:crypto";

import VerificationGrant from "./verificationGrantModel.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

const ALLOWED_PURPOSES = new Set([
  "registration",
  "mobile_change",
]);

function createTokenHash(token) {
  return crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function validateGrantInput({ mobile, purpose, token }) {
  if (typeof mobile !== "string" || !mobile.trim()) {
    throw new Error("INVALID_MOBILE");
  }

  if (!ALLOWED_PURPOSES.has(purpose)) {
    throw new Error("INVALID_VERIFICATION_PURPOSE");
  }

  if (
    typeof token !== "string" ||
    !/^[A-Za-z0-9_-]{43}$/.test(token)
  ) {
    throw new Error("INVALID_VERIFICATION_TOKEN");
  }
}

export async function consumeVerificationGrant({
  mobile,
  purpose,
  token,
  session,
}) {
  mobile = normalizeMobile(mobile);

  validateGrantInput({ mobile, purpose, token });

  if (!session || !session.inTransaction()) {
    throw new Error("VERIFICATION_GRANT_REQUIRES_TRANSACTION");
  }

  const now = new Date();
  const tokenHash = createTokenHash(token);

  const grant = await VerificationGrant.findOneAndUpdate(
    {
      mobile,
      purpose,
      tokenHash,
      consumedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: {
        consumedAt: now,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
      session,
    }
  );

  if (!grant) {
    throw new Error("VERIFICATION_GRANT_INVALID_OR_EXPIRED");
  }

  return {
    mobile: grant.mobile,
    purpose: grant.purpose,
    verified: true,
  };
}
