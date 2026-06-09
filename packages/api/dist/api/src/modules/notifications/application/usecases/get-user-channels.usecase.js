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
exports.GetUserChannelsUseCase = void 0;
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let GetUserChannelsUseCase = class GetUserChannelsUseCase {
    constructor(userRepository, userNotificationRepository, messageRepository) {
        this.userRepository = userRepository;
        this.userNotificationRepository = userNotificationRepository;
        this.messageRepository = messageRepository;
    }
    async execute(userId) {
        const matchList = await this.userNotificationRepository.findMatchByUserId(userId);
        const channelMap = new Map();
        const channelIdList = [];
        for (const m of matchList) {
            channelIdList.push(m.id);
            if (channelMap.has(m.id)) {
                continue;
            }
            const interlocutorId = m.author === userId ? m.fromUser : m.author;
            const matchedUser = await this.userRepository.findUserProfileById(interlocutorId);
            const newChannel = {
                id: m.id,
                interlocutor: matchedUser,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
                messageList: [],
            };
            channelMap.set(newChannel.id, newChannel);
        }
        const messageList = await this.messageRepository.findByChannelIdList(channelIdList);
        for (const message of messageList) {
            const messageChannel = channelMap.get(message.channelId);
            if (!messageChannel) {
                continue;
            }
            messageChannel.messageList.push(message);
        }
        return [...channelMap.values()];
    }
};
exports.GetUserChannelsUseCase = GetUserChannelsUseCase;
exports.GetUserChannelsUseCase = GetUserChannelsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserNotificationRepository)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.MessageRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetUserChannelsUseCase);
