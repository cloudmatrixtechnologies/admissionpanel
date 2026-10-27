
import {
  parsePhoneNumber,
  getCountries,
} from "libphonenumber-js";

const SUPPORTED_COUNTRIES = new Set(getCountries());

export function normalizeMobile(input, defaultCountry) {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("INVALID_MOBILE");
  }

  const value = input.trim();

  // Remove common formatting, but do not accept letters or extensions.
  const cleaned = value.replace(/[\s().-]/g, "");

  if (!/^\+?\d+$/.test(cleaned)) {
    throw new Error("INVALID_MOBILE");
  }

  let phone;

  try {
    if (cleaned.startsWith("+")) {
      // International format: country is explicit.
      phone = parsePhoneNumber(cleaned);
    } else {
      // National format requires an explicit ISO country code.
      if (
        typeof defaultCountry !== "string" ||
        !SUPPORTED_COUNTRIES.has(defaultCountry.toUpperCase())
      ) {
        throw new Error("COUNTRY_REQUIRED");
      }

      phone = parsePhoneNumber(
        cleaned,
        defaultCountry.toUpperCase()
      );
    }
  } catch {
    throw new Error("INVALID_MOBILE");
  }

  if (!phone || !phone.isValid()) {
    throw new Error("INVALID_MOBILE");
  }

  return phone.number;
}
