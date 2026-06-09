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
exports.RefreshAccessTokenUseCase = void 0;
const result_1 = require("../../../../modules/shared/utils/result");
const inversify_1 = require("inversify");
const verify_token_error_1 = require("../../../../modules/auth/application/errors/verify-token.error");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let RefreshAccessTokenUseCase = class RefreshAccessTokenUseCase {
    constructor(accessTokenService) {
        this.accessTokenService = accessTokenService;
    }
    async execute(refreshToken, ipAddr, device) {
        const userToken = await this.accessTokenService.find(refreshToken);
        if (!userToken) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
        }
        const now = new Date();
        if (userToken.expireAt && userToken.expireAt <= now) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.TOKEN_EXPIRED);
        }
        if (userToken.ipAddr !== ipAddr && userToken.device !== device) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.UNKNOWN_CLIENT);
        }
        await this.accessTokenService.revokeToken(refreshToken);
        const newAccessToken = await this.accessTokenService.issueNewAccessToken({
            userId: userToken.userId,
            issueAt: now,
            device,
            ipAddr,
        });
        return (0, result_1.Ok)(newAccessToken);
    }
};
exports.RefreshAccessTokenUseCase = RefreshAccessTokenUseCase;
exports.RefreshAccessTokenUseCase = RefreshAccessTokenUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __metadata("design:paramtypes", [Object])
], RefreshAccessTokenUseCase);
