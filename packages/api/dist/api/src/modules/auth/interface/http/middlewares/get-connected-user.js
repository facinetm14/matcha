"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedUserId = getConnectedUserId;
exports.getConnectedUserIdFromSocket = getConnectedUserIdFromSocket;
const verify_token_error_1 = require("../../../../../modules/auth/application/errors/verify-token.error");
const result_1 = require("../../../../../modules/shared/utils/result");
const attach_secure_cookies_1 = require("./attach-secure-cookies");
async function getConnectedUserId(accessTokenService, req, resp) {
    const accessToken = req.token;
    if (accessToken) {
        const verifyAccessTokenResult = await accessTokenService.verifyAccessToken(accessToken);
        if (!verifyAccessTokenResult.isErr) {
            return (0, result_1.Ok)(verifyAccessTokenResult.data);
        }
    }
    const refreshToken = req.refresh;
    if (!refreshToken) {
        return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
    }
    const userToken = await accessTokenService.find(refreshToken);
    if (!userToken) {
        return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
    }
    const newAccessToken = await accessTokenService.issueNewAccessToken({
        userId: userToken.userId,
        issueAt: new Date(),
        ipAddr: userToken.ipAddr,
        device: userToken.device,
    });
    await accessTokenService.revokeToken(refreshToken);
    (0, attach_secure_cookies_1.attachTokensToSecureCookies)(resp, newAccessToken);
    return (0, result_1.Ok)(userToken.userId);
}
async function getConnectedUserIdFromSocket(socket, accessTokenService) {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
    }
    const [token, refresh] = cookies
        .split(';')
        .map((item) => item.slice(item.indexOf('=') + 1));
    if (!token) {
        return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
    }
    const verifyAccessTokenResult = await accessTokenService.verifyAccessToken(token);
    if (!verifyAccessTokenResult.isErr) {
        return (0, result_1.Ok)(verifyAccessTokenResult.data);
    }
    if (refresh) {
        const userToken = await accessTokenService.find(refresh);
        if (!userToken) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
        }
        return (0, result_1.Ok)(userToken.userId);
    }
    const userToken = await accessTokenService.find(token);
    if (!userToken) {
        return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
    }
    return (0, result_1.Ok)(userToken.userId);
}
