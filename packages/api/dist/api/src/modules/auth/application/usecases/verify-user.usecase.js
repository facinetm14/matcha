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
exports.VerifyUserUseCase = void 0;
const verify_token_error_1 = require("../errors/verify-token.error");
const result_1 = require("../../../shared/utils/result");
const inversify_1 = require("inversify");
const user_status_enum_1 = require("../../../users/application/consts/user-status.enum");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let VerifyUserUseCase = class VerifyUserUseCase {
    constructor(userTokenRepository, userRepository) {
        this.userTokenRepository = userTokenRepository;
        this.userRepository = userRepository;
    }
    async execute(validationToken) {
        const existingToken = await this.userTokenRepository.findById(validationToken);
        if (!existingToken) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
        }
        await this.userRepository.update(existingToken.userId, {
            status: user_status_enum_1.UserStatus.VERIFIED,
            updatedAt: new Date(),
        });
        await this.userTokenRepository.delete(existingToken.id);
        return (0, result_1.Ok)(null);
    }
};
exports.VerifyUserUseCase = VerifyUserUseCase;
exports.VerifyUserUseCase = VerifyUserUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserTokenRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], VerifyUserUseCase);
