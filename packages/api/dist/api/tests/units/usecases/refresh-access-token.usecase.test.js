"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const access_token_manager_1 = require("../../../src/modules/auth/infrastructure/adapters/services/access-token-manager");
const access_token_ttl_1 = require("../../../src/modules/auth/application/consts/access-token-ttl");
const verify_token_error_1 = require("../../../src/modules/auth/application/errors/verify-token.error");
const refresh_token_usecase_1 = require("../../../src/modules/auth/application/usecases/refresh-token.usecase");
const factory_1 = require("../../../src/modules/shared/utils/factory");
describe('Refresh Access Token Usecase', () => {
    let refreshAccessTokenUseCase;
    let accessTokenService;
    const ipAddr = '00000';
    const device = 'test-device';
    const userId = 'user-id';
    beforeAll(async () => {
        accessTokenService = new access_token_manager_1.AccessTokenManager((0, factory_1.factoryUserTokenRepositoryInMemory)());
        refreshAccessTokenUseCase = new refresh_token_usecase_1.RefreshAccessTokenUseCase(accessTokenService);
    });
    test('should return error when refresh token is invalid', async () => {
        const refreshTokenResult = await refreshAccessTokenUseCase.execute('invalid-token', ipAddr, device);
        expect(refreshTokenResult).toMatchObject({
            isErr: true,
            error: verify_token_error_1.VerifyTokenError.INVALID_TOKEN,
        });
    });
    test('should return error when refresh token is expired', async () => {
        const now = new Date();
        const accessToken = await accessTokenService.issueNewAccessToken({
            userId,
            issueAt: new Date(now.getTime() - access_token_ttl_1.REFRESH_ACESS_TOKEN_TTL_IN_MS),
            device,
            ipAddr,
        });
        const refreshTokenResult = await refreshAccessTokenUseCase.execute(accessToken.refresh, ipAddr, device);
        expect(refreshTokenResult).toMatchObject({
            isErr: true,
            error: verify_token_error_1.VerifyTokenError.TOKEN_EXPIRED,
        });
    });
    test('should return error when client ip and device change even if token is valid', async () => {
        const accessToken = await accessTokenService.issueNewAccessToken({
            userId,
            issueAt: new Date(),
            device,
            ipAddr,
        });
        const refreshTokenResult = await refreshAccessTokenUseCase.execute(accessToken.refresh, 'different-ip', 'diffrent-device');
        expect(refreshTokenResult).toMatchObject({
            isErr: true,
            error: verify_token_error_1.VerifyTokenError.UNKNOWN_CLIENT,
        });
    });
    test('should return ok, when refreshtoken is valid and ip or device match', async () => {
        const accessToken = await accessTokenService.issueNewAccessToken({
            userId,
            issueAt: new Date(),
            device,
            ipAddr,
        });
        const refreshTokenResult = await refreshAccessTokenUseCase.execute(accessToken.refresh, ipAddr, device);
        expect(refreshTokenResult).toMatchObject({
            isErr: false,
        });
    });
});
