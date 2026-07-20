"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inject_authorization_token_1 = require("../../../../auth/interface/http/middlewares/inject-authorization-token");
const chat_controller_1 = require("../controllers/chat.controller");
const inversify_1 = __importDefault(require("../../../../../config/ioc/inversify"));
//
const chatController = inversify_1.default.get(chat_controller_1.ChatController);
const ChatRouter = (0, express_1.Router)();
ChatRouter.get('/channels', inject_authorization_token_1.injectAuthorizationToken, (req, resp) => {
    chatController.findUserChannels(req, resp);
});
exports.default = ChatRouter;
