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
exports.AccessTokenManager = void 0;
const inversify_1 = require("inversify");
const factory_1 = require("../../../../../modules/shared/utils/factory");
const user_token_category_1 = require("../../../../../modules/auth/application/consts/user-token-category");
const access_token_ttl_1 = require("../../../../../modules/auth/application/consts/access-token-ttl");
const jose_1 = require("jose");
const verify_token_error_1 = require("../../../../../modules/auth/application/errors/verify-token.error");
const result_1 = require("../../../../../modules/shared/utils/result");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const key = new TextEncoder().encode(process.env.JWT_SECRET);
let AccessTokenManager = class AccessTokenManager {
    constructor(userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }
    async issueNewAccessToken(newAccessToken) {
        const userToken = (0, factory_1.factoryUserToken)({
            userId: newAccessToken.userId,
            category: user_token_category_1.UserTokenCateory.SESSION,
            expireAt: new Date(newAccessToken.issueAt.getTime() + access_token_ttl_1.REFRESH_ACESS_TOKEN_TTL_IN_MS),
            createdAt: newAccessToken.issueAt,
            updatedAt: newAccessToken.issueAt,
            device: newAccessToken.device,
            ipAddr: newAccessToken.ipAddr,
        });
        await this.userTokenRepository.create(userToken);
        const refresh = userToken.id;
        const token = await this.createAccessToken(userToken.userId, userToken.token);
        return { token, refresh };
    }
    async revokeToken(refreshToken) {
        await this.userTokenRepository.delete(refreshToken);
    }
    async find(token) {
        return this.userTokenRepository.findById(token);
    }
    async createAccessToken(userId, token) {
        return new jose_1.SignJWT({ sub: userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(access_token_ttl_1.ACCESS_TOKEN_TTL_IN_MIN)
            .setJti(token)
            .sign(key);
    }
    async verifyAccessToken(token) {
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, key);
            if (payload && payload.sub) {
                return (0, result_1.Ok)(payload.sub);
            }
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.INVALID_TOKEN);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (_) {
            return (0, result_1.Err)(verify_token_error_1.VerifyTokenError.TOKEN_EXPIRED);
        }
    }
};
exports.AccessTokenManager = AccessTokenManager;
exports.AccessTokenManager = AccessTokenManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserTokenRepository)),
    __metadata("design:paramtypes", [Object])
], AccessTokenManager);
