"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./modules/auth/interface/http/routers/auth.router"));
const user_router_1 = __importDefault(require("./modules/users/interface/http/routers/user.router"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
const auth_rate_limit_1 = require("./modules/auth/application/consts/auth-rate-limit");
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const chat_router_1 = __importDefault(require("./modules/notifications/interface/http/routers/chat.router"));
const inversify_1 = __importDefault(require("./config/ioc/inversify"));
const inversify_type_1 = require("./config/ioc/inversify-type");
const apiBaseRoute = process.env.BASE_API ?? '/api/v1';
const createApp = () => {
    const app = (0, express_1.default)();
    const rateLimiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: auth_rate_limit_1.AuthRateLimit.TIME,
        limit: auth_rate_limit_1.AuthRateLimit.REQUEST,
        ipv6Subnet: 52,
        message: 'Too many requests, please try again later.',
    });
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    const server = (0, node_http_1.createServer)(app);
    const socketServer = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_HOST,
            credentials: true,
        },
    });
    inversify_1.default
        .bind(inversify_type_1.TYPE.SocketIoServer)
        .toConstantValue(socketServer);
    app.use(`${apiBaseRoute}/auth`, rateLimiter, auth_router_1.default);
    app.use(`${apiBaseRoute}/users`, user_router_1.default);
    app.use(`${apiBaseRoute}/chats`, chat_router_1.default);
    return { server, app };
};
exports.createApp = createApp;
