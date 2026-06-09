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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const register_user_usecase_1 = require("../../../application/usecases/register-user.usecase");
const uuid_1 = require("../../../../../../../shared/uuid");
const register_user_error_1 = require("../../../application/errors/register-user.error");
const verify_user_usecase_1 = require("../../../application/usecases/verify-user.usecase");
const user_token_category_1 = require("../../../application/consts/user-token-category");
const login_user_usecase_1 = require("../../../application/usecases/login-user.usecase");
const login_user_error_1 = require("../../../application/errors/login-user.error");
const factory_1 = require("../../../../../modules/shared/utils/factory");
const refresh_token_usecase_1 = require("../../../../../modules/auth/application/usecases/refresh-token.usecase");
const verify_token_error_1 = require("../../../../../modules/auth/application/errors/verify-token.error");
const reset_password_usecase_1 = require("../../../../../modules/auth/application/usecases/reset-password.usecase");
const reset_password_error_1 = require("../../../../../modules/auth/application/errors/reset-password.error");
const confirm_reset_password_usecase_1 = require("../../../../../modules/auth/application/usecases/confirm-reset-password.usecase");
const create_new_password_usecase_1 = require("../../../../../modules/auth/application/usecases/create-new-password.usecase");
const create_new_password_error_1 = require("../../../../../modules/auth/application/errors/create-new-password.error");
const attach_secure_cookies_1 = require("../middlewares/attach-secure-cookies");
const get_connected_user_1 = require("../middlewares/get-connected-user");
const logout_usecase_1 = require("../../../../../modules/auth/application/usecases/logout.usecase");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const create_user_dto_validation_1 = require("../../validations/create-user-dto.validation");
const login_user_dto_validation_1 = require("../../validations/login-user-dto.validation");
const refresh_token_dto_validation_1 = require("../../validations/refresh-token-dto.validation");
const create_reset_password_link_dto_validation_1 = require("../../validations/create-reset-password-link-dto.validation");
const create_new_password_dto_validation_1 = require("../../validations/create-new-password-dto.validation");
let AuthController = class AuthController {
    constructor(registerUserUseCase, logger, verifyUserUseCase, loginUserUseCase, refreshTokenUseCase, resetPasswordUseCase, confirmResetPasswordUseCase, createNewPasswordUseCase, accessTokenService, logoutUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.logger = logger;
        this.verifyUserUseCase = verifyUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.confirmResetPasswordUseCase = confirmResetPasswordUseCase;
        this.createNewPasswordUseCase = createNewPasswordUseCase;
        this.accessTokenService = accessTokenService;
        this.logoutUseCase = logoutUseCase;
    }
    async registerUser(req, resp) {
        const parsedBody = create_user_dto_validation_1.CreateUserDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const createUserDto = { ...parsedBody.data, id: (0, uuid_1.uuid)() };
        const device = `${JSON.stringify(req.headers['user-agent'])}`;
        const ipAddr = `${req.ip}`;
        const now = new Date();
        const userToken = (0, factory_1.factoryUserToken)({
            userId: createUserDto.id,
            category: user_token_category_1.UserTokenCateory.ONE_TIME,
            expireAt: null,
            ipAddr,
            device,
            createdAt: now,
            updatedAt: now,
        });
        const registerUserResult = await this.registerUserUseCase.execute(createUserDto, userToken);
        if (registerUserResult.isErr) {
            const error = registerUserResult.error;
            this.handleRegisterUserError(error, resp);
            return;
        }
        resp.status(201).json(registerUserResult.data);
    }
    handleRegisterUserError(error, resp) {
        switch (error) {
            case register_user_error_1.RegisterUserError.EMAIL_ALREADY_EXISTS:
            case register_user_error_1.RegisterUserError.USER_NAME_ALREADY_EXISTS:
                return resp.status(409).send(error);
            case register_user_error_1.RegisterUserError.UNKNOWN_ERROR:
                return resp.status(500).send(error);
            default:
                return resp.status(400).send(error);
        }
    }
    async verifyUserEmail(req, resp) {
        const { validationToken } = req.params;
        if (!validationToken) {
            resp.status(400).send('bad request');
            return;
        }
        const activateUserAccountResult = await this.verifyUserUseCase.execute(validationToken);
        if (activateUserAccountResult.isErr) {
            resp.status(401).send('invalid token');
            return;
        }
        resp.status(200).send('user email successfully verified');
    }
    handleLoginUserError(error, resp) {
        switch (error) {
            case login_user_error_1.LoginUserError.USER_UNVERIFIED:
                return resp.status(403).send('user not verified');
            default:
                return resp.status(401).send('invalid credentials');
        }
    }
    async loginUser(req, resp) {
        const parsedBody = login_user_dto_validation_1.LoginUserDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const loginUserDto = parsedBody.data;
        const device = `${JSON.stringify(req.headers['user-agent'])}`;
        const ipAddr = `${req.ip}`;
        const loginUserResult = await this.loginUserUseCase.execute(loginUserDto, device, ipAddr);
        if (loginUserResult.isErr) {
            const error = loginUserResult.error;
            this.handleLoginUserError(error, resp);
            return;
        }
        const { token, refresh } = loginUserResult.data;
        (0, attach_secure_cookies_1.attachTokensToSecureCookies)(resp, { token, refresh });
        resp.status(200).json({ token, refresh });
    }
    async refreshToken(req, resp) {
        const parsedBody = refresh_token_dto_validation_1.RefreshTokenDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const refreshTokenDto = parsedBody.data;
        const device = `${JSON.stringify(req.headers['user-agent'])}`;
        const ipAddr = `${req.ip}`;
        const refreshTokenResult = await this.refreshTokenUseCase.execute(refreshTokenDto.refreshToken, ipAddr, device);
        if (refreshTokenResult.isErr) {
            const error = refreshTokenResult.error;
            if (error === verify_token_error_1.VerifyTokenError.UNKNOWN_CLIENT) {
                resp.status(403).send('Unknown client');
                return;
            }
            resp.status(401).send('Invalid token');
            return;
        }
        resp.status(201).json(refreshTokenResult.data);
    }
    async resetPassword(req, resp) {
        const parsedBody = create_reset_password_link_dto_validation_1.CreateResetPasswordLinkDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('bad request');
            return;
        }
        const { email } = parsedBody.data;
        const resetPasswordResult = await this.resetPasswordUseCase.execute(email);
        if (resetPasswordResult.isErr) {
            const error = resetPasswordResult.error;
            if (error === reset_password_error_1.ResetPasswordError.USER_NOT_FOUND) {
                resp.status(404).send(`no user found with ${email}`);
                return;
            }
            resp.status(500).json('server internal error, please try later!');
            return;
        }
        resp.status(200).json(resetPasswordResult.data);
    }
    async confirmResetPassword(req, resp) {
        const { validationToken } = req.params;
        if (!validationToken) {
            resp.status(400).send('baq request');
            return;
        }
        const device = `${JSON.stringify(req.headers['user-agent'])}`;
        const ipAddr = `${req.ip}`;
        const confrimResetPasswordResult = await this.confirmResetPasswordUseCase.execute(validationToken, ipAddr, device);
        if (confrimResetPasswordResult.isErr) {
            resp.status(401).send('invalid token');
            return;
        }
        const accessToken = confrimResetPasswordResult.data;
        (0, attach_secure_cookies_1.attachTokensToSecureCookies)(resp, { token: accessToken.token });
        resp.status(200).json(accessToken);
    }
    async createNewPassword(req, resp) {
        const parsedBody = create_new_password_dto_validation_1.CreateNewPasswordDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('bad request');
            return;
        }
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('invalid token');
            return;
        }
        const createNewPasswordDto = parsedBody.data;
        const createNewPasswordResult = await this.createNewPasswordUseCase.execute(createNewPasswordDto, connectedUserResult.data);
        if (createNewPasswordResult.isErr) {
            const error = createNewPasswordResult.error;
            this.handleCreateNewPasswordError(error, resp);
            return;
        }
        resp.status(200).send('password successfully updated!');
    }
    handleCreateNewPasswordError(error, resp) {
        switch (error) {
            case create_new_password_error_1.CreateNewPasswordError.MIS_MATCH_PASSWORD:
                return resp.status(400).send('mismatch password and confirm password');
            case create_new_password_error_1.CreateNewPasswordError.USER_NOT_FOUND:
                return resp.status(404).send('user not found');
            case create_new_password_error_1.CreateNewPasswordError.WEAK_PASSWORD:
                return resp.status(400).send('weak password');
            default:
                return resp.status(500).send('unknown error, please retry later');
        }
    }
    async logout(req, resp) {
        const refresh = req.cookies.refresh ?? req.refresh;
        await this.logoutUseCase.execute(refresh);
        (0, attach_secure_cookies_1.clearSessionCookies)(resp);
        resp.status(200).send('successfully logged out');
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(register_user_usecase_1.RegisterUserUseCase)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __param(2, (0, inversify_1.inject)(verify_user_usecase_1.VerifyUserUseCase)),
    __param(3, (0, inversify_1.inject)(login_user_usecase_1.LoginUserUseCase)),
    __param(4, (0, inversify_1.inject)(refresh_token_usecase_1.RefreshAccessTokenUseCase)),
    __param(5, (0, inversify_1.inject)(reset_password_usecase_1.ResetPasswordUseCase)),
    __param(6, (0, inversify_1.inject)(confirm_reset_password_usecase_1.ConfrimResetPasswordUseCase)),
    __param(7, (0, inversify_1.inject)(create_new_password_usecase_1.CreateNewPasswordUseCase)),
    __param(8, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __param(9, (0, inversify_1.inject)(logout_usecase_1.LogoutUseCase)),
    __metadata("design:paramtypes", [register_user_usecase_1.RegisterUserUseCase, Object, verify_user_usecase_1.VerifyUserUseCase,
        login_user_usecase_1.LoginUserUseCase,
        refresh_token_usecase_1.RefreshAccessTokenUseCase,
        reset_password_usecase_1.ResetPasswordUseCase,
        confirm_reset_password_usecase_1.ConfrimResetPasswordUseCase,
        create_new_password_usecase_1.CreateNewPasswordUseCase, Object, logout_usecase_1.LogoutUseCase])
], AuthController);
