"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachTokensToSecureCookies = attachTokensToSecureCookies;
exports.clearSessionCookies = clearSessionCookies;
const access_token_ttl_1 = require("../../../../../modules/auth/application/consts/access-token-ttl");
function attachTokensToSecureCookies(resp, { token, refresh }) {
    clearSessionCookies(resp);
    resp.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: access_token_ttl_1.ACCESS_TOKEN_TTL_IN_MS,
    });
    if (refresh) {
        resp.cookie('refresh', refresh, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: access_token_ttl_1.REFRESH_ACESS_TOKEN_TTL_IN_MS,
        });
    }
}
function clearSessionCookies(resp) {
    resp.clearCookie('refresh');
    resp.clearCookie('token');
}
