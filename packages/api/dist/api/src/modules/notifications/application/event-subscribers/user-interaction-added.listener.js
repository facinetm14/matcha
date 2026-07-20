"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_type_1 = require("../../../shared/consts/event-type");
const socket_events_1 = require("../../../../../../shared/socket-events");
const uuid_1 = require("../../../../../../shared/uuid");
const inversify_1 = __importDefault(require("../../../../config/ioc/inversify"));
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const notification_time_1 = require("../../../../../../shared/notification-time");
const eventBus = inversify_1.default.get(inversify_type_1.TYPE.EventBus);
const logger = inversify_1.default.get(inversify_type_1.TYPE.Logger);
const socketIoServer = inversify_1.default.get(inversify_type_1.TYPE.SocketIoServer);
const notificationService = inversify_1.default.get(inversify_type_1.TYPE.NotificationService);
const userInteractionRepository = inversify_1.default.get(inversify_type_1.TYPE.UserInteractionRepository);
const shouldPreventViewSpam = (lastView, notification) => {
    return (!!lastView &&
        new Date(notification.createdAt).getTime() -
            new Date(lastView.createdAt).getTime() <=
            notification_time_1.VIEW_NOTIFICATION_INTERVAL_IN_MS);
};
eventBus.subscribe(event_type_1.EventType.USER_INTERACTION_ADDED, async (payload) => {
    const notification = JSON.parse(payload);
    if (notification.category === 'view') {
        const lastView = await userInteractionRepository.findInteraction({
            author: notification.fromUser,
            recipient: notification.author,
            category: notification.category,
        });
        if (!lastView) {
            await userInteractionRepository.create({ category: notification.category, recipient: notification.author }, notification.fromUser);
        }
        if (shouldPreventViewSpam(lastView, notification)) {
            return;
        }
        if (lastView) {
            await userInteractionRepository.delete({ ...lastView }, notification.fromUser);
            await userInteractionRepository.create({ category: notification.category, recipient: notification.author }, notification.fromUser);
        }
    }
    if (notification.category === 'like') {
        const like = await userInteractionRepository.findInteraction({
            author: notification.author,
            recipient: notification.fromUser,
            category: notification.category,
        });
        if (like) {
            await notificationService.createAppNotification({
                ...notification,
                id: (0, uuid_1.uuid)(),
                category: 'match',
            });
        }
    }
    if (notification.category === 'unlike' ||
        notification.category === 'block') {
        await notificationService.deleteMatch(notification.author, notification.fromUser);
    }
    await notificationService.createAppNotification(notification);
    logger.info(`creating notification for ${notification.author}`);
    socketIoServer
        .to(notification.author)
        .emit(socket_events_1.SocketEvents.USER_INTERACTION_ADDED, notification);
});
