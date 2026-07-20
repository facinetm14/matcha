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
exports.AddUserInteractionUseCase = void 0;
const event_type_1 = require("../../../../modules/shared/consts/event-type");
const user_uniq_keys_enum_1 = require("../../../../modules/users/application/consts/user-uniq-keys.enum");
const result_1 = require("../../../../modules/shared/utils/result");
const uuid_1 = require("../../../../../../shared/uuid");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let AddUserInteractionUseCase = class AddUserInteractionUseCase {
    constructor(userRepository, userInteractionRepository, eventBus) {
        this.userRepository = userRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.eventBus = eventBus;
    }
    async execute(createInteractionDto, userId) {
        const author = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.ID, userId);
        if (!author) {
            return (0, result_1.Err)('author_not_found');
        }
        const recipientUser = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.ID, createInteractionDto.recipient);
        if (!recipientUser) {
            return (0, result_1.Err)('recipient_not_found');
        }
        if (author.id === recipientUser.id) {
            return (0, result_1.Err)('unauthorized');
        }
        const now = new Date();
        const notification = {
            id: (0, uuid_1.uuid)(),
            author: createInteractionDto.recipient,
            fromUser: userId,
            isRead: false,
            createdAt: now,
            updatedAt: now,
            category: createInteractionDto.category,
        };
        if (this.isRevokingCategory(createInteractionDto.category)) {
            if (createInteractionDto.category === 'block') {
                console.log('delete like please');
                await this.userInteractionRepository.delete({
                    ...createInteractionDto,
                    category: 'like',
                }, userId);
            }
            await this.userInteractionRepository.delete({
                ...createInteractionDto,
                category: this.getCategoryToRevoke(createInteractionDto.category),
            }, userId);
            this.eventBus.publish(event_type_1.EventType.USER_INTERACTION_ADDED, JSON.stringify(notification));
            return (0, result_1.Ok)(null);
        }
        const newInteraction = await this.userInteractionRepository.create(createInteractionDto, userId);
        if (!newInteraction) {
            return (0, result_1.Err)('unknow_error');
        }
        this.eventBus.publish(event_type_1.EventType.USER_INTERACTION_ADDED, JSON.stringify(notification));
        return (0, result_1.Ok)(null);
    }
    isRevokingCategory(category) {
        return category.startsWith('un');
    }
    getCategoryToRevoke(category) {
        return category.slice(2);
    }
};
exports.AddUserInteractionUseCase = AddUserInteractionUseCase;
exports.AddUserInteractionUseCase = AddUserInteractionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserInteractionRepository)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AddUserInteractionUseCase);
