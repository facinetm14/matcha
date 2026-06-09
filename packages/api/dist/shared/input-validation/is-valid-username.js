"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERNAME_MAX_LENGTH = exports.USERNAME_MIN_LENGTH = void 0;
exports.isValidUsername = isValidUsername;
exports.USERNAME_MIN_LENGTH = 3;
exports.USERNAME_MAX_LENGTH = 30;
function isValidUsername(username) {
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!username) {
        return { valid: false, error: "Username is required." };
    }
    if (username.length < exports.USERNAME_MIN_LENGTH) {
        return {
            valid: false,
            error: `Username must be at least ${exports.USERNAME_MIN_LENGTH} characters long.`,
        };
    }
    if (username.length > exports.USERNAME_MAX_LENGTH) {
        return {
            valid: false,
            error: `Username must not exceed ${exports.USERNAME_MAX_LENGTH} characters.`,
        };
    }
    if (!usernamePattern.test(username)) {
        return {
            valid: false,
            error: "Username can only contain letters, numbers, and underscores.",
        };
    }
    return { valid: true };
}
