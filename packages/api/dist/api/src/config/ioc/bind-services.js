"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindServices = bindServices;
const access_token_manager_1 = require("../../modules/auth/infrastructure/adapters/services/access-token-manager");
const email_api_brevo_1 = require("../../modules/shared/adapters/email-api-brevo");
const logger_std_1 = require("../../modules/shared/adapters/logger-std");
const node_event_bus_1 = require("../../modules/shared/adapters/node-event-bus");
const notification_manager_1 = require("../../modules/shared/adapters/notification-manager");
const redis_cache_api_1 = require("../../modules/shared/adapters/redis-cache-api");
const socket_io_listener_1 = require("../event-subscribers/socket-io.listener");
const inversify_type_1 = require("./inversify-type");
const geocode_openstreetmap_1 = require("../../modules/users/infrastructure/adapters/services/geocode-openstreetmap");
const ip_location_IpApi_1 = require("../../modules/auth/infrastructure/adapters/services/ip-location.IpApi");
function bindServices(container) {
    container.bind(socket_io_listener_1.SocketIoListener).toSelf().inSingletonScope();
    container.bind(inversify_type_1.TYPE.Logger).to(logger_std_1.LoggerStd).inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.GeocodeService)
        .to(geocode_openstreetmap_1.GeocodeOpenStreetMap)
        .inSingletonScope();
    container.bind(inversify_type_1.TYPE.EventBus).to(node_event_bus_1.NodeEventBus).inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.NotificationService)
        .to(notification_manager_1.NotificationManager)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.EmailService)
        .to(email_api_brevo_1.EmailApiBrevo)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.CacheService)
        .to(redis_cache_api_1.RedisCacheApi)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.AccessTokenService)
        .to(access_token_manager_1.AccessTokenManager)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.IpLocation)
        .to(ip_location_IpApi_1.IpLocationIpApi)
        .inSingletonScope();
}
