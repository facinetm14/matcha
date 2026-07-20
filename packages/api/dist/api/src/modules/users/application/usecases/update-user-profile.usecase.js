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
exports.UpdateUserProfileUseCase = void 0;
const event_type_1 = require("../../../../modules/shared/consts/event-type");
const user_uniq_keys_enum_1 = require("../../../../modules/users/application/consts/user-uniq-keys.enum");
const update_user_profile_error_1 = require("../../../../modules/users/application/errors/update-user-profile.error");
const result_1 = require("../../../../modules/shared/utils/result");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const uuid_1 = require("../../../../../../shared/uuid");
let UpdateUserProfileUseCase = class UpdateUserProfileUseCase {
    constructor(userRepository, userInterestRepository, eventBus, userLocationRepository) {
        this.userRepository = userRepository;
        this.userInterestRepository = userInterestRepository;
        this.eventBus = eventBus;
        this.userLocationRepository = userLocationRepository;
    }
    async execute(userId, updateUserProfileDto) {
        const { tags, photos, location, ...user } = updateUserProfileDto;
        if (user) {
            const existingUsername = user.username
                ? await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.username, user.username)
                : null;
            const isUsernameUsed = existingUsername && existingUsername.id !== userId;
            if (isUsernameUsed) {
                return (0, result_1.Err)(update_user_profile_error_1.UpdateUserProfileError.USERNAME_ALREADY_EXISTS);
            }
            const existingEmail = user.email
                ? await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.EMAIL, user.email)
                : null;
            const isEmailUsed = existingEmail && existingEmail.id !== userId;
            if (isEmailUsed) {
                return (0, result_1.Err)(update_user_profile_error_1.UpdateUserProfileError.EMAIL_AREDAY_EXISTS);
            }
            const { sexualOrientation, ...updateUserDto } = user;
            if (Object.entries(updateUserDto).length || sexualOrientation?.length) {
                const updatedUser = await this.userRepository.update(userId, {
                    ...updateUserDto,
                    ...(sexualOrientation?.length && {
                        sexualOrientation: sexualOrientation.join(' '),
                    }),
                });
                if (!updatedUser) {
                    return (0, result_1.Err)(update_user_profile_error_1.UpdateUserProfileError.UNKNOWN_ERROR);
                }
            }
        }
        if (photos) {
            this.eventBus.publish(event_type_1.EventType.UPLOAD_USER_IMAGE, JSON.stringify({ author: userId, photos }));
        }
        if (tags) {
            await this.userInterestRepository.deleteByUserId(userId);
            if (tags.length) {
                await this.userInterestRepository.bulkCreate(userId, tags);
            }
        }
        if (location) {
            const existingLocation = await this.userLocationRepository.findByUserId(userId);
            if (existingLocation) {
                await this.userLocationRepository.update(userId, location);
            }
            else {
                const createUserLocation = {
                    ...location,
                    id: (0, uuid_1.uuid)(),
                    userId,
                };
                await this.userLocationRepository.create(createUserLocation);
            }
        }
        const updatedUserProfileResult = await this.userRepository.findUserProfileById(userId);
        if (!updatedUserProfileResult) {
            return (0, result_1.Err)(update_user_profile_error_1.UpdateUserProfileError.USER_NOT_FOUND);
        }
        return (0, result_1.Ok)(updatedUserProfileResult);
    }
};
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserInterestRepository)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __param(3, (0, inversify_1.inject)(inversify_type_1.TYPE.UserLocationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UpdateUserProfileUseCase);
