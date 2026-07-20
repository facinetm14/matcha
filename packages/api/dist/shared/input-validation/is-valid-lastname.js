"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LASTNAME_MAX_LENGTH = exports.LASTNAME_MIN_LENGTH = void 0;
exports.isValidLastname = isValidLastname;
exports.LASTNAME_MIN_LENGTH = 3;
exports.LASTNAME_MAX_LENGTH = 30;
function isValidLastname(lastName) {
    const lastNamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+$/;
    if (!lastName) {
        return { valid: false, error: "Last name is required." };
    }
    if (lastName.length < exports.LASTNAME_MIN_LENGTH) {
        return {
            valid: false,
            error: `Last name must be at least ${exports.LASTNAME_MIN_LENGTH} characters long.`,
        };
    }
    if (lastName.length > exports.LASTNAME_MAX_LENGTH) {
        return {
            valid: false,
            error: `Last name must not exceed ${exports.LASTNAME_MAX_LENGTH} characters.`,
        };
    }
    if (!lastNamePattern.test(lastName)) {
        return {
            valid: false,
            error: "Last name can only contain letters, hyphens, and apostrophes.",
        };
    }
    return { valid: true };
}
