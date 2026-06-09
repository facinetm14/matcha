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
exports.ConfrimResetPasswordUseCase = void 0;
const verify_token_error_1 = require("../../../../modules/auth/application/errors/verify-token.error");
const result_1 = require("../../../../modules/shared/utils/result");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let ConfrimResetPasswordUseCase = class ConfrimResetPasswordUseCase {
    constructor(accessTokenService) {
        this.accessTokenService = accessTokenService;
    }
    async execute(token, ipAddr, device) {
        const userToken = await this.accessTokenService.find(token);
        if (!userToken) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
        }
        await this.accessTokenService.revokeToken(token);
        const newAccessToken = await this.accessTokenService.issueNewAccessToken({
            ipAddr,
            device,
            userId: userToken.userId,
            issueAt: new Date(),
        });
        return (0, result_1.Ok)(newAccessToken);
    }
};
exports.ConfrimResetPasswordUseCase = ConfrimResetPasswordUseCase;
exports.ConfrimResetPasswordUseCase = ConfrimResetPasswordUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __metadata("design:paramtypes", [Object])
], ConfrimResetPasswordUseCase);
