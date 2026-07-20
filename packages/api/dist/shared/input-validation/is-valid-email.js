"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_MAX_LENGTH = void 0;
exports.isValidEmail = isValidEmail;
exports.EMAIL_MAX_LENGTH = 254;
function isValidEmail(email) {
    const patterns = /^[^\s@]+@[^\s@]+\.[^\s@]/;
    const emailRegex = new RegExp(patterns);
    if (!email) {
        return { valid: false, error: "Email is required." };
    }
    if (email.length > exports.EMAIL_MAX_LENGTH) {
        return {
            valid: false,
            error: `Email must not exceed ${exports.EMAIL_MAX_LENGTH} characters.`,
        };
    }
    if (!email.match(emailRegex)) {
        return { valid: false, error: "Invalid email format." };
    }
    return { valid: true };
}
