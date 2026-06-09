"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const inject_authorization_token_1 = require("../../../../auth/interface/http/middlewares/inject-authorization-token");
const inversify_1 = __importDefault(require("../../../../../config/ioc/inversify"));
const userController = inversify_1.default.get(user_controller_1.UserController);
const UserRouter = (0, express_1.Router)();
UserRouter.get(`/me`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.getMe(req, resp);
});
UserRouter.post(`/search`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.filterUsers(req, resp);
});
UserRouter.get('/browse', inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.browse(req, resp);
});
UserRouter.post(`/profile`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.viewUserProfileList(req, resp);
});
UserRouter.get(`/:id/view`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.viewUserProfile(req, resp, { isViewing: true });
});
UserRouter.get(`/:id/profile`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.viewUserProfile(req, resp);
});
UserRouter.post(`/check-identifier`, (req, resp) => {
    userController.checkUserIdentifierAvailability(req, resp);
});
UserRouter.patch(`/update`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.updateUserProfile(req, resp);
});
UserRouter.post(`/interaction`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.addUserInteraction(req, resp);
});
UserRouter.get(`/images/:filename`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.getImage(req, resp);
});
UserRouter.post(`/images/remove`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.deleteImages(req, resp);
});
UserRouter.patch(`/images/reorder`, inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.reorderImages(req, resp);
});
UserRouter.get('/tags', inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    userController.findAllInterests(req, resp);
});
UserRouter.get('/reverse-geocode', userController.geoGode);
exports.default = UserRouter;
