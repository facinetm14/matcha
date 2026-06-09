"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTokenError = void 0;
var VerifyTokenError;
(function (VerifyTokenError) {
    VerifyTokenError["INVALID_TOKEN"] = "INVALID_TOKEN";
    VerifyTokenError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    VerifyTokenError["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    VerifyTokenError["UNKNOWN_CLIENT"] = "UNKNOWN_CLIENT";
    VerifyTokenError["FORBIDDEN"] = "FORBIDDEN";
})(VerifyTokenError || (exports.VerifyTokenError = VerifyTokenError = {}));
