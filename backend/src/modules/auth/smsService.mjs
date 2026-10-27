
function maskMobile(mobile) {
  if (typeof mobile !== "string" || mobile.length < 4) {
    return "[hidden]";
  }

  return `******${mobile.slice(-4)}`;
}

export async function sendOtpSms(mobile, otp) {
  const isLocalConsoleMode =
    process.env.NODE_ENV === "development" &&
    process.env.OTP_DELIVERY_MODE === "console";

  // Fail closed: never use console OTP delivery in production.
  if (!isLocalConsoleMode) {
    throw new Error("SMS_PROVIDER_NOT_CONFIGURED");
  }

  if (
    typeof otp !== "string" ||
    !/^\d{6}$/.test(otp)
  ) {
    throw new Error("INVALID_OTP");
  }

  // Development-only: this code must never run in production.
  console.log("\n========== DEVELOPMENT OTP ==========");
  console.log("Destination:", maskMobile(mobile));
  console.log("OTP:", otp);
  console.log("Expires in: 5 minutes");
  console.log("Development only — do not use in production.");
  console.log("=====================================\n");

  return { success: true };
}
