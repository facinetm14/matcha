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
exports.SocketIoListener = void 0;
const inversify_1 = require("inversify");
const socket_io_1 = require("socket.io");
const socket_events_1 = require("../../../../shared/socket-events");
const get_connected_user_1 = require("../../modules/auth/interface/http/middlewares/get-connected-user");
const inversify_type_1 = require("../../config/ioc/inversify-type");
const create_message_dto_validation_1 = require("../../modules/notifications/interface/validations/create-message-dto.validation");
const cache_ressource_keys_1 = require("../../modules/shared/consts/cache-ressource-keys");
const notification_time_1 = require("../../../../shared/notification-time");
const send_message_usecase_1 = require("../../modules/notifications/application/usecases/send-message.usecase");
let SocketIoListener = class SocketIoListener {
    constructor(serverSocket, accessTokenService, cacheService, eventBus, userNotificationRepository, sendMessageUseCase) {
        this.serverSocket = serverSocket;
        this.accessTokenService = accessTokenService;
        this.cacheService = cacheService;
        this.eventBus = eventBus;
        this.userNotificationRepository = userNotificationRepository;
        this.sendMessageUseCase = sendMessageUseCase;
    }
    async handleSocketEvents() {
        this.serverSocket.on(socket_events_1.SocketEvents.CONNECTION, async (socket) => {
            const connectedUserResult = await (0, get_connected_user_1.getConnectedUserIdFromSocket)(socket, this.accessTokenService);
            if (connectedUserResult.isErr) {
                socket.disconnect(true);
                return;
            }
            const userId = connectedUserResult.data;
            const isConnectedUser = await this.cacheService.findById(cache_ressource_keys_1.CacheResourceKeys.CONNECTED_USERS, userId);
            if (!isConnectedUser) {
                await this.cacheService.insert(cache_ressource_keys_1.CacheResourceKeys.CONNECTED_USERS, {
                    id: userId,
                });
            }
            socket.join(userId);
            socket.on(socket_events_1.SocketEvents.DISCONNECT, async () => {
                await this.cacheService.delete(cache_ressource_keys_1.CacheResourceKeys.CONNECTED_USERS, userId);
                const lastConnection = await this.cacheService.findById(cache_ressource_keys_1.CacheResourceKeys.LAST_CONNEXION, userId);
                if (lastConnection) {
                    await this.cacheService.delete(cache_ressource_keys_1.CacheResourceKeys.LAST_CONNEXION, userId);
                }
                this.cacheService.insert(cache_ressource_keys_1.CacheResourceKeys.LAST_CONNEXION, {
                    id: userId,
                    lastSeen: new Date(),
                });
                socket.leave(userId);
                socket.disconnect(true);
                this.serverSocket
                    .except(userId)
                    .emit(socket_events_1.SocketEvents.USER_DISCONNECTED, { userId });
            });
            socket.on(socket_events_1.SocketEvents.SEND_MESSAGE, async (message) => {
                const parseMessage = create_message_dto_validation_1.CreateMessageDtoSchema.safeParse(message);
                if (!parseMessage.success) {
                    return;
                }
                const sanitized = parseMessage.data;
                const interlocutor = await this.sendMessageUseCase.execute(sanitized);
                this.serverSocket
                    .to([message.senderId, interlocutor])
                    .timeout(notification_time_1.OUTGOING_MESSAGE_TIMEOUT_MS)
                    .emit(socket_events_1.SocketEvents.RECEIVE_MESSAGE, sanitized.channelId);
            });
            socket.on(socket_events_1.SocketEvents.READING_NOTIFICATION, async ({ category, author }) => {
                if (category !== 'message') {
                    await this.userNotificationRepository.updateReadStatusById(author);
                }
                else {
                    await this.userNotificationRepository.updateReadStatusByAuthorAndFromUser(userId, author);
                }
                this.serverSocket
                    .timeout(notification_time_1.OUTGOING_MESSAGE_TIMEOUT_MS)
                    .emit(socket_events_1.SocketEvents.NOTIFICATION_READ, author);
            });
            this.serverSocket
                .except(userId)
                .emit(socket_events_1.SocketEvents.USER_CONNECTED, { userId });
        });
    }
};
exports.SocketIoListener = SocketIoListener;
exports.SocketIoListener = SocketIoListener = __decorate([
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.SocketIoServer)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.CacheService)),
    __param(3, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __param(4, (0, inversify_1.inject)(inversify_type_1.TYPE.UserNotificationRepository)),
    __param(5, (0, inversify_1.inject)(send_message_usecase_1.SendMessageUsceCase)),
    __metadata("design:paramtypes", [socket_io_1.Server, Object, Object, Object, Object, send_message_usecase_1.SendMessageUsceCase])
], SocketIoListener);
