import { ValidationResult } from "./interfaces";

export const LASTNAME_MIN_LENGTH = 3;
export const LASTNAME_MAX_LENGTH = 30;

export function isValidLastname(lastName: string): ValidationResult {
  const lastNamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+$/;

  if (!lastName) {
    return { valid: false, error: "Last name is required." };
  }

  if (lastName.length < LASTNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Last name must be at least ${LASTNAME_MIN_LENGTH} characters long.`,
    };
  }

  if (lastName.length > LASTNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Last name must not exceed ${LASTNAME_MAX_LENGTH} characters.`,
    };
  }

  if (!lastNamePattern.test(lastName)) {
    return {
      valid: false,
      error:
        "Last name can only contain letters, hyphens, and apostrophes.",
    };
  }

  return { valid: true };
}