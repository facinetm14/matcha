"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_MAX_LENGTH = exports.PASSWORD_MIN_LENGTH = void 0;
exports.isPasswordStrong = isPasswordStrong;
exports.isValidPassword = isValidPassword;
exports.PASSWORD_MIN_LENGTH = 12;
exports.PASSWORD_MAX_LENGTH = 128;
function isPasswordStrong(passwd, minLength = exports.PASSWORD_MIN_LENGTH) {
    const rulePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9_]).+$/;
    const passwdRegex = new RegExp(rulePattern);
    return passwd.length >= minLength && !!passwd.match(passwdRegex);
}
function isValidPassword(password) {
    if (!password) {
        return { valid: false, error: 'Password is required.' };
    }
    if (password.length < exports.PASSWORD_MIN_LENGTH) {
        return {
            valid: false,
            error: `Password must be at least ${exports.PASSWORD_MIN_LENGTH} characters long.`,
        };
    }
    if (password.length > exports.PASSWORD_MAX_LENGTH) {
        return {
            valid: false,
            error: `Password must not exceed ${exports.PASSWORD_MAX_LENGTH} characters.`,
        };
    }
    if (!isPasswordStrong(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        };
    }
    return { valid: true };
}
