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
exports.CreateNewPasswordUseCase = void 0;
const create_new_password_error_1 = require("../../../../modules/auth/application/errors/create-new-password.error");
const inversify_1 = require("inversify");
const result_1 = require("../../../../modules/shared/utils/result");
const password_1 = require("../../../../modules/auth/infrastructure/utils/password");
const is_valid_password_1 = require("../../../../../../shared/input-validation/is-valid-password");
const user_uniq_keys_enum_1 = require("../../../../modules/users/application/consts/user-uniq-keys.enum");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let CreateNewPasswordUseCase = class CreateNewPasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(createNewPasswordDto, userId) {
        const existingUser = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.ID, userId);
        if (!existingUser) {
            return (0, result_1.Err)(create_new_password_error_1.CreateNewPasswordError.USER_NOT_FOUND);
        }
        if (!(0, is_valid_password_1.isPasswordStrong)(createNewPasswordDto.passwd)) {
            return (0, result_1.Err)(create_new_password_error_1.CreateNewPasswordError.WEAK_PASSWORD);
        }
        if (createNewPasswordDto.passwd !== createNewPasswordDto.confirmPasswd) {
            return (0, result_1.Err)(create_new_password_error_1.CreateNewPasswordError.MIS_MATCH_PASSWORD);
        }
        const passwd = await (0, password_1.hashPassword)(createNewPasswordDto.passwd);
        const userWithNewPassword = {
            passwd,
        };
        const updatedUser = await this.userRepository.update(existingUser.id, userWithNewPassword);
        if (!updatedUser) {
            return (0, result_1.Err)(create_new_password_error_1.CreateNewPasswordError.UNKNOWN_ERROR);
        }
        return (0, result_1.Ok)(null);
    }
};
exports.CreateNewPasswordUseCase = CreateNewPasswordUseCase;
exports.CreateNewPasswordUseCase = CreateNewPasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __metadata("design:paramtypes", [Object])
], CreateNewPasswordUseCase);
