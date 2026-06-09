"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserError = void 0;
var RegisterUserError;
(function (RegisterUserError) {
    RegisterUserError["INVALID_USER_EMAIL"] = "Invalid_user_email";
    RegisterUserError["INVALID_USER_NAME"] = "Invalid_user_name";
    RegisterUserError["INVALID_USER_FIRST_NAME"] = "Invalid_user_firstname";
    RegisterUserError["INVALID_USER_LAST_NAME"] = "Invalid_user_lastname";
    RegisterUserError["INVALID_USER_PASSWD"] = "Invalid_user_password";
    RegisterUserError["MISMATCH_CONFIRM_PASSWD_WITH_PASSWD"] = "Mismatch_confirm_passwordd_with_password";
    RegisterUserError["USER_PASSWD_WEAK"] = "Weak_user_password";
    RegisterUserError["UNKNOWN_ERROR"] = "Unknown_error";
    RegisterUserError["EMAIL_ALREADY_EXISTS"] = "Email_already_exists";
    RegisterUserError["USER_NAME_ALREADY_EXISTS"] = "Username_already_exists";
})(RegisterUserError || (exports.RegisterUserError = RegisterUserError = {}));
