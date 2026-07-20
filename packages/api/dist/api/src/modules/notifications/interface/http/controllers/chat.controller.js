"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const inversify_1 = require("inversify");
const get_connected_user_1 = require("../../../../auth/interface/http/middlewares/get-connected-user");
const get_user_channels_usecase_1 = require("../../../../../modules/notifications/application/usecases/get-user-channels.usecase");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let ChatController = class ChatController {
    constructor(accessTokenService, getUserChannelsUseCase) {
        this.accessTokenService = accessTokenService;
        this.getUserChannelsUseCase = getUserChannelsUseCase;
    }
    async findUserChannels(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const channelList = await this.getUserChannelsUseCase.execute(connectedUserResult.data);
        resp.status(200).send(channelList);
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __param(1, (0, inversify_1.inject)(get_user_channels_usecase_1.GetUserChannelsUseCase)),
    __metadata("design:paramtypes", [Object, get_user_channels_usecase_1.GetUserChannelsUseCase])
], ChatController);
