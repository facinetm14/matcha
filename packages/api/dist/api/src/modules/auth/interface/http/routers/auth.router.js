"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const inject_authorization_token_1 = require("../middlewares/inject-authorization-token");
const inversify_1 = __importDefault(require("../../../../../config/ioc/inversify"));
const authController = inversify_1.default.get(auth_controller_1.AuthController);
const AuthRouter = (0, express_1.Router)();
AuthRouter.post(`/register`, (req, resp) => {
    authController.registerUser(req, resp);
});
AuthRouter.post('/verify/:validationToken', (req, resp) => {
    authController.verifyUserEmail(req, resp);
});
AuthRouter.post('/login', (req, resp) => {
    authController.loginUser(req, resp);
});
AuthRouter.post('/refresh-token', (req, resp) => {
    authController.refreshToken(req, resp);
});
AuthRouter.post('/reset-password', (req, resp) => {
    authController.resetPassword(req, resp);
});
AuthRouter.post('/confirm-reset-password/:validationToken', (req, resp) => {
    authController.confirmResetPassword(req, resp);
});
AuthRouter.post('/create-new-password', inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    authController.createNewPassword(req, resp);
});
AuthRouter.post('/logout', inject_authorization_token_1.injectAuthorizationTokenForLogout, (req, resp) => {
    authController.logout(req, resp);
});
exports.default = AuthRouter;
