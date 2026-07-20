"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDtoSchema = void 0;
const z = __importStar(require("zod"));
const is_valid_email_1 = require("../../../../../../shared/input-validation/is-valid-email");
const is_valid_username_1 = require("../../../../../../shared/input-validation/is-valid-username");
const is_valid_firstname_1 = require("../../../../../../shared/input-validation/is-valid-firstname");
const is_valid_lastname_1 = require("../../../../../../shared/input-validation/is-valid-lastname");
const is_valid_password_1 = require("../../../../../../shared/input-validation/is-valid-password");
exports.CreateUserDtoSchema = z.object({
    email: z.email().max(is_valid_email_1.EMAIL_MAX_LENGTH),
    username: z.string().trim().min(is_valid_username_1.USERNAME_MIN_LENGTH).max(is_valid_username_1.USERNAME_MAX_LENGTH),
    firstName: z
        .string()
        .trim()
        .min(is_valid_firstname_1.FIRSTNAME_MIN_LENGTH)
        .max(is_valid_firstname_1.FIRSTNAME_MAX_LENGTH),
    lastName: z.string().trim().min(is_valid_lastname_1.LASTNAME_MIN_LENGTH).max(is_valid_lastname_1.LASTNAME_MAX_LENGTH),
    passwd: z.string().max(is_valid_password_1.PASSWORD_MAX_LENGTH),
    confirmPasswd: z.string().min(is_valid_password_1.PASSWORD_MIN_LENGTH).max(is_valid_password_1.PASSWORD_MAX_LENGTH),
});
