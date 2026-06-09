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
exports.SendMessageUsceCase = void 0;
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const uuid_1 = require("../../../../../../shared/uuid");
const event_type_1 = require("../../../../modules/shared/consts/event-type");
let SendMessageUsceCase = class SendMessageUsceCase {
    constructor(messageRepository, userNotificationRepository, eventBus) {
        this.messageRepository = messageRepository;
        this.userNotificationRepository = userNotificationRepository;
        this.eventBus = eventBus;
    }
    async execute(createMessage) {
        const channel = await this.userNotificationRepository.findMatchById(createMessage.channelId);
        if (!channel) {
            return;
        }
        if (createMessage.senderId !== channel.author &&
            createMessage.senderId !== channel.fromUser) {
            return;
        }
        const now = new Date();
        const newMessage = {
            id: (0, uuid_1.uuid)(),
            senderId: createMessage.senderId,
            content: createMessage.content,
            channelId: createMessage.channelId,
            isRead: false,
            createdAt: now,
            updatedAt: now,
        };
        await this.messageRepository.create(newMessage);
        const interlocutor = channel.author === createMessage.senderId
            ? channel.fromUser
            : channel.author;
        const notification = {
            id: `${(0, uuid_1.uuid)()}-msg-${createMessage.channelId}`,
            author: interlocutor,
            fromUser: newMessage.senderId,
            category: 'message',
            createdAt: now,
            updatedAt: now,
            isRead: false,
        };
        this.eventBus.publish(event_type_1.EventType.USER_INTERACTION_ADDED, JSON.stringify(notification));
        return interlocutor;
    }
};
exports.SendMessageUsceCase = SendMessageUsceCase;
exports.SendMessageUsceCase = SendMessageUsceCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.MessageRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserNotificationRepository)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SendMessageUsceCase);
