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
exports.ResetPasswordUseCase = void 0;
const event_type_1 = require("../../../../modules/shared/consts/event-type");
const user_token_category_1 = require("../../../../modules/auth/application/consts/user-token-category");
const user_uniq_keys_enum_1 = require("../../../../modules/users/application/consts/user-uniq-keys.enum");
const reset_password_error_1 = require("../../../../modules/auth/application/errors/reset-password.error");
const result_1 = require("../../../../modules/shared/utils/result");
const factory_1 = require("../../../../modules/shared/utils/factory");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let ResetPasswordUseCase = class ResetPasswordUseCase {
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(email) {
        const existingUser = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.EMAIL, email);
        if (!existingUser) {
            return (0, result_1.Err)(reset_password_error_1.ResetPasswordError.USER_NOT_FOUND);
        }
        const userToken = (0, factory_1.factoryUserToken)({
            userId: existingUser.id,
            category: user_token_category_1.UserTokenCateory.ONE_TIME,
        });
        const payload = {
            email,
            username: existingUser.username,
            userToken,
        };
        this.eventBus.publish(event_type_1.EventType.RESET_PASSWORD_WISHED_BY_USER, JSON.stringify(payload));
        return (0, result_1.Ok)(userToken.id);
    }
};
exports.ResetPasswordUseCase = ResetPasswordUseCase;
exports.ResetPasswordUseCase = ResetPasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object])
], ResetPasswordUseCase);
