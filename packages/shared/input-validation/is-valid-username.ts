import { ValidationResult } from "./interfaces";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export function isValidUsername(username: string): ValidationResult {
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  if (!username) {
    return { valid: false, error: "Username is required." };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`,
    };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must not exceed ${USERNAME_MAX_LENGTH} characters.`,
    };
  }

  if (!usernamePattern.test(username)) {
    return {
      valid: false,
      error:
        "Username can only contain letters, numbers, and underscores.",
    };
  }

  return { valid: true };
}