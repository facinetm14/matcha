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
exports.RegisterUserUseCase = void 0;
const inversify_1 = require("inversify");
const register_user_error_1 = require("../errors/register-user.error");
const result_1 = require("../../../shared/utils/result");
const user_uniq_keys_enum_1 = require("../../../users/application/consts/user-uniq-keys.enum");
const is_valid_password_1 = require("../../../../../../shared/input-validation/is-valid-password");
const password_1 = require("../../infrastructure/utils/password");
const is_valid_email_1 = require("../../../../../../shared/input-validation/is-valid-email");
const event_type_1 = require("../../../shared/consts/event-type");
const user_status_enum_1 = require("../../../users/application/consts/user-status.enum");
const default_sexual_orientation_1 = require("../../../../modules/users/application/consts/default-sexual-orientation");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let RegisterUserUseCase = class RegisterUserUseCase {
    constructor(userRepository, logger, eventBus) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.eventBus = eventBus;
    }
    async execute(createUserDto, userToken) {
        const lastName = createUserDto.lastName.trim();
        if (!lastName) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.INVALID_USER_LAST_NAME);
        }
        const firstName = createUserDto.firstName.trim();
        if (!firstName) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.INVALID_USER_FIRST_NAME);
        }
        const passwd = createUserDto.passwd;
        if (!passwd) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.INVALID_USER_PASSWD);
        }
        const confirmPasswd = createUserDto.confirmPasswd;
        if (passwd !== confirmPasswd) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.MISMATCH_CONFIRM_PASSWD_WITH_PASSWD);
        }
        const isStrongPasswd = (0, is_valid_password_1.isPasswordStrong)(passwd, is_valid_password_1.PASSWORD_MIN_LENGTH);
        if (!isStrongPasswd) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.USER_PASSWD_WEAK);
        }
        const username = createUserDto.username.trim();
        if (!username) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.INVALID_USER_NAME);
        }
        const existingUserWithUsername = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.username, username);
        if (existingUserWithUsername) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.USER_NAME_ALREADY_EXISTS);
        }
        const email = createUserDto.email.trim();
        if (!email || !(0, is_valid_email_1.isValidEmail)(email)) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.INVALID_USER_EMAIL);
        }
        const existingUserWithUserEmail = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.EMAIL, email);
        if (existingUserWithUserEmail) {
            return (0, result_1.Err)(register_user_error_1.RegisterUserError.EMAIL_ALREADY_EXISTS);
        }
        const hashedPasswd = await (0, password_1.hashPassword)(createUserDto.passwd);
        const now = new Date();
        const newUserId = await this.userRepository.create({
            ...createUserDto,
            passwd: hashedPasswd,
            createdAt: now,
            updatedAt: now,
            status: user_status_enum_1.UserStatus.UNVERIFIED,
            sexualOrientation: default_sexual_orientation_1.DEFAULT_SEXUAL_ORIENTATION,
        });
        if (newUserId) {
            const UserRegisteredEventPayload = {
                username,
                email,
                userToken,
            };
            this.eventBus.publish(event_type_1.EventType.USER_REGISTERED, JSON.stringify(UserRegisteredEventPayload));
            this.logger.success(`user with id ${newUserId} is sucessfully registered!`);
            return (0, result_1.Ok)(UserRegisteredEventPayload.userToken.id);
        }
        return (0, result_1.Err)(register_user_error_1.RegisterUserError.UNKNOWN_ERROR);
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RegisterUserUseCase);
