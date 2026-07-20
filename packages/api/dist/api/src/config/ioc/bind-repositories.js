"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindRepositories = bindRepositories;
const inversify_type_1 = require("./inversify-type");
const user_interest_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-interest-repository-db");
const user_interaction_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-interaction-repository-db");
const user_image_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-image-repository-db");
const user_token_repository_cache_1 = require("../../modules/auth/infrastructure/adapters/repositories/user-token-repository-cache");
const user_notification_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-notification-repository-db");
const message_repository_db_1 = require("../../modules/notifications/infrastructure/adapters/repositories/message-repository-db");
const user_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-repository-db");
const user_location_repository_db_1 = require("../../modules/users/infrastructure/adapters/repositories/user-location-repository-db");
function bindRepositories(container) {
    container
        .bind(inversify_type_1.TYPE.UserRepository)
        .to(user_repository_db_1.UserRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserTokenRepository)
        .to(user_token_repository_cache_1.UserTokenRepositoryInCache)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserInterestRepository)
        .to(user_interest_repository_db_1.UserInterestRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserInteractionRepository)
        .to(user_interaction_repository_db_1.UserInteractionRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserNotificationRepository)
        .to(user_notification_repository_db_1.UserNotificationRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserImageRepository)
        .to(user_image_repository_db_1.UserImageRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.MessageRepository)
        .to(message_repository_db_1.MessageRepositoryDb)
        .inSingletonScope();
    container
        .bind(inversify_type_1.TYPE.UserLocationRepository)
        .to(user_location_repository_db_1.UserLocationRepositoryDb)
        .inSingletonScope();
}
