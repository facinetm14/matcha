"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindControllers = bindControllers;
const chat_controller_1 = require("../../modules/notifications/interface/http/controllers/chat.controller");
const auth_controller_1 = require("../../modules/auth/interface/http/controllers/auth.controller");
const user_controller_1 = require("../../modules/users/interface/http/controllers/user.controller");
function bindControllers(container) {
    container.bind(auth_controller_1.AuthController).toSelf().inSingletonScope();
    container.bind(user_controller_1.UserController).toSelf().inSingletonScope();
    container.bind(chat_controller_1.ChatController).toSelf().inSingletonScope();
}
