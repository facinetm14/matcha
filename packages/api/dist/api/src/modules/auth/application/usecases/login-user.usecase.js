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
exports.LoginUserUseCase = void 0;
const inversify_1 = require("inversify");
const result_1 = require("../../../shared/utils/result");
const login_user_error_1 = require("../errors/login-user.error");
const user_uniq_keys_enum_1 = require("../../../users/application/consts/user-uniq-keys.enum");
const password_1 = require("../../infrastructure/utils/password");
const user_status_enum_1 = require("../../../users/application/consts/user-status.enum");
const user_token_category_1 = require("../consts/user-token-category");
const access_token_ttl_1 = require("../consts/access-token-ttl");
const factory_1 = require("../../../../modules/shared/utils/factory");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const uuid_1 = require("../../../../../../shared/uuid");
let LoginUserUseCase = class LoginUserUseCase {
    constructor(userRepository, userTokenRepository, accessTokenService, iplocation, userLocationRepository) {
        this.userRepository = userRepository;
        this.userTokenRepository = userTokenRepository;
        this.accessTokenService = accessTokenService;
        this.iplocation = iplocation;
        this.userLocationRepository = userLocationRepository;
    }
    async execute(loginUserDto, device, ipAddr) {
        if (!loginUserDto.username) {
            return (0, result_1.Err)(login_user_error_1.LoginUserError.INVALID_CREDENTIALS);
        }
        const existingUser = await this.userRepository.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.username, loginUserDto.username);
        if (!existingUser) {
            return (0, result_1.Err)(login_user_error_1.LoginUserError.INVALID_CREDENTIALS);
        }
        if (existingUser.status === user_status_enum_1.UserStatus.UNVERIFIED) {
            return (0, result_1.Err)(login_user_error_1.LoginUserError.USER_UNVERIFIED);
        }
        const matchPasswd = await (0, password_1.verifyPassword)(existingUser.passwd, loginUserDto.passwd);
        if (!matchPasswd) {
            return (0, result_1.Err)(login_user_error_1.LoginUserError.INVALID_CREDENTIALS);
        }
        const now = new Date();
        const expireAt = new Date(now.getTime() + access_token_ttl_1.REFRESH_ACESS_TOKEN_TTL_IN_MS);
        const userToken = (0, factory_1.factoryUserToken)({
            userId: existingUser.id,
            category: user_token_category_1.UserTokenCateory.SESSION,
            expireAt,
            createdAt: now,
            updatedAt: now,
            device,
            ipAddr,
        });
        await this.userTokenRepository.create(userToken);
        const existingLocation = await this.userLocationRepository.findByUserId(existingUser.id);
        if (!existingLocation) {
            const location = await this.iplocation.getLocation(ipAddr);
            await this.userLocationRepository.create({
                ...location,
                userId: existingUser.id,
                id: (0, uuid_1.uuid)(),
            });
        }
        const refresh = userToken.id;
        const token = await this.accessTokenService.createAccessToken(existingUser.id, userToken.token);
        return (0, result_1.Ok)({ token, refresh });
    }
};
exports.LoginUserUseCase = LoginUserUseCase;
exports.LoginUserUseCase = LoginUserUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserTokenRepository)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __param(3, (0, inversify_1.inject)(inversify_type_1.TYPE.IpLocation)),
    __param(4, (0, inversify_1.inject)(inversify_type_1.TYPE.UserLocationRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], LoginUserUseCase);
