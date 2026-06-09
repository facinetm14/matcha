"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_type_1 = require("../../shared/consts/event-type");
const inversify_1 = __importDefault(require("../../../config/ioc/inversify"));
const inversify_type_1 = require("../../../config/ioc/inversify-type");
const eventBus = inversify_1.default.get(inversify_type_1.TYPE.EventBus);
const logger = inversify_1.default.get(inversify_type_1.TYPE.Logger);
const userTokenRepository = inversify_1.default.get(inversify_type_1.TYPE.UserTokenRepository);
const notificationService = inversify_1.default.get(inversify_type_1.TYPE.NotificationService);
eventBus.subscribe(event_type_1.EventType.USER_REGISTERED, async (payload) => {
    const UserRegisteredEventPayload = JSON.parse(payload);
    if (!UserRegisteredEventPayload) {
        logger.error(`Failed to handle ${event_type_1.EventType.USER_REGISTERED} event caused by invalid payload`);
        return;
    }
    const token = await userTokenRepository.create(UserRegisteredEventPayload.userToken);
    if (!token) {
        logger.error(`Failed to handle ${event_type_1.EventType.USER_REGISTERED} event caused by failure to store user token in cache`);
        return;
    }
    if (process.env.DEBUG === 'true') {
        logger.info(`Received event: ${event_type_1.EventType.USER_REGISTERED} but sending email is skipped in debug mode`);
        return;
    }
    logger.info(`Sending registration notification to ${UserRegisteredEventPayload.email}`);
    notificationService.createUserRegisteredNotifification(UserRegisteredEventPayload);
});
