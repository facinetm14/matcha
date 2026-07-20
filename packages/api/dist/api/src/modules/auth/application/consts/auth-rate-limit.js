"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRateLimit = void 0;
var AuthRateLimit;
(function (AuthRateLimit) {
    AuthRateLimit[AuthRateLimit["TIME"] = 60000] = "TIME";
    AuthRateLimit[AuthRateLimit["REQUEST"] = 10] = "REQUEST";
})(AuthRateLimit || (exports.AuthRateLimit = AuthRateLimit = {}));
