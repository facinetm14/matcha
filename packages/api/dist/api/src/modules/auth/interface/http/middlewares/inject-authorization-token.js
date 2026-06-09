"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectAuthorizationToken = injectAuthorizationToken;
exports.injectAuthorizationTokenForLogout = injectAuthorizationTokenForLogout;
function injectAuthorizationToken(req, resp, next) {
    const authorization = req.headers['authorization'];
    if (authorization && authorization.startsWith('Bearer ')) {
        const [, accessToken, refresh] = authorization.split(' ');
        if (!accessToken) {
            resp.status(401).send('No authorization token provided');
            return;
        }
        req.token = accessToken;
        req.refresh = refresh;
        return next();
    }
    const { token, refresh } = req.cookies;
    req.token = token;
    req.refresh = refresh;
    if (token || refresh) {
        return next();
    }
    resp.status(401).send('No authorization token provided');
}
function injectAuthorizationTokenForLogout(req, _resp, next) {
    const authorization = req.headers['authorization'];
    if (authorization && authorization.startsWith('Bearer ')) {
        const [, accessToken, refreshToken] = authorization.split(' ');
        if (accessToken) {
            req.token = accessToken;
        }
        if (refreshToken) {
            req.refresh = refreshToken;
        }
        return next();
    }
    const { token, refresh } = req.cookies;
    req.token = token;
    req.refresh = refresh;
    return next();
}
