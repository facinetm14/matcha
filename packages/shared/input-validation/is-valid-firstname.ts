import { ValidationResult } from "./interfaces";

export const FIRSTNAME_MIN_LENGTH = 3;
export const FIRSTNAME_MAX_LENGTH = 30;

export function isValidFirstname(firstName: string): ValidationResult {
  const firstNamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+$/;

  if (!firstName) {
    return { valid: false, error: "First name is required." };
  }

  if (firstName.length < FIRSTNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `First name must be at least ${FIRSTNAME_MIN_LENGTH} characters long.`,
    };
  }

  if (firstName.length > FIRSTNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `First name must not exceed ${FIRSTNAME_MAX_LENGTH} characters.`,
    };
  }

  if (!firstNamePattern.test(firstName)) {
    return {
      valid: false,
      error:
        "First name can only contain letters, hyphens, and apostrophes.",
    };
  }

  return { valid: true };
}