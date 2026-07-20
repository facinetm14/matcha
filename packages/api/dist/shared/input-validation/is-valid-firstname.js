"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIRSTNAME_MAX_LENGTH = exports.FIRSTNAME_MIN_LENGTH = void 0;
exports.isValidFirstname = isValidFirstname;
exports.FIRSTNAME_MIN_LENGTH = 3;
exports.FIRSTNAME_MAX_LENGTH = 30;
function isValidFirstname(firstName) {
    const firstNamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ'-]+$/;
    if (!firstName) {
        return { valid: false, error: "First name is required." };
    }
    if (firstName.length < exports.FIRSTNAME_MIN_LENGTH) {
        return {
            valid: false,
            error: `First name must be at least ${exports.FIRSTNAME_MIN_LENGTH} characters long.`,
        };
    }
    if (firstName.length > exports.FIRSTNAME_MAX_LENGTH) {
        return {
            valid: false,
            error: `First name must not exceed ${exports.FIRSTNAME_MAX_LENGTH} characters.`,
        };
    }
    if (!firstNamePattern.test(firstName)) {
        return {
            valid: false,
            error: "First name can only contain letters, hyphens, and apostrophes.",
        };
    }
    return { valid: true };
}
