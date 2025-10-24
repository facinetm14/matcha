import { ValidationResult } from "./interfaces";

export const EMAIL_MAX_LENGTH = 254;

export function isValidEmail(email: string): ValidationResult {
  const patterns = /^[^\s@]+@[^\s@]+\.[^\s@]/;
  const emailRegex = new RegExp(patterns);

  if (!email) {
    return { valid: false, error: "Email is required." };
  }

  if (email.length > EMAIL_MAX_LENGTH) {
    return {
      valid: false,
      error: `Email must not exceed ${EMAIL_MAX_LENGTH} characters.`,
    };
  }

  if (!email.match(emailRegex)) {
    return { valid: false, error: "Invalid email format." };
  }

  return { valid: true };
}