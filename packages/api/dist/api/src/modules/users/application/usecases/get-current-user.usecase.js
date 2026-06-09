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
exports.GetCurrentUserUseCase = void 0;
const result_1 = require("../../../shared/utils/result");
const verify_token_error_1 = require("../../../auth/application/errors/verify-token.error");
const inversify_1 = require("inversify");
const uuid_1 = require("../../../../../../shared/uuid");
const event_type_1 = require("../../../../modules/shared/consts/event-type");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let GetCurrentUserUseCase = class GetCurrentUserUseCase {
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(userId, targetUserId, isViewing) {
        const userProfile = await this.userRepository.findUserProfileById(targetUserId ?? userId);
        if (targetUserId && targetUserId !== userId) {
            const currentUser = await this.userRepository.findUserProfileById(userId);
            if (currentUser?.blocked.includes(targetUserId)) {
                return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.FORBIDDEN);
            }
        }
        if (!userProfile) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.USER_NOT_FOUND);
        }
        if (userProfile.isFirstLogin) {
            await this.userRepository.update(userId, { isFirstLogin: null });
        }
        if (targetUserId && userId !== targetUserId && isViewing) {
            const now = new Date();
            const notification = {
                id: (0, uuid_1.uuid)(),
                fromUser: userId,
                author: targetUserId,
                category: 'view',
                isRead: false,
                createdAt: now,
                updatedAt: now,
            };
            this.eventBus.publish(event_type_1.EventType.USER_INTERACTION_ADDED, JSON.stringify(notification));
        }
        return (0, result_1.Ok)(userProfile);
    }
};
exports.GetCurrentUserUseCase = GetCurrentUserUseCase;
exports.GetCurrentUserUseCase = GetCurrentUserUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object])
], GetCurrentUserUseCase);
