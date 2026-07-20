"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const uuid_1 = require("../../../../shared/uuid");
const verify_user_usecase_1 = require("../../../src/modules/auth/application/usecases/verify-user.usecase");
const verify_token_error_1 = require("../../../src/modules/auth/application/errors/verify-token.error");
const factory_1 = require("../../../src/modules/shared/utils/factory");
(0, node_test_1.describe)('Verify user email', () => {
    let token;
    let verifyUserUseCase;
    let userTokenRepository;
    beforeAll(() => {
        token = (0, uuid_1.uuid)();
        userTokenRepository = (0, factory_1.factoryUserTokenRepositoryInMemory)();
        verifyUserUseCase = new verify_user_usecase_1.VerifyUserUseCase(userTokenRepository, (0, factory_1.factoryUserRepositoryInMemory)());
    });
    test('should return error when token is invalid', async () => {
        const verfyUserResult = await verifyUserUseCase.execute(token);
        expect(verfyUserResult).toMatchObject({
            isErr: true,
            error: verify_token_error_1.VerifyTokenError.INVALID_TOKEN,
        });
    });
    test('should return ok when token is valid', async () => {
        const userToken = await userTokenRepository.create((0, factory_1.factoryUserToken)({}));
        const verfyUserResult = await verifyUserUseCase.execute(`${userToken}`);
        expect(verfyUserResult).toMatchObject({
            isErr: false,
        });
    });
    test('should return error when token is already used', async () => {
        const verfyUserResult = await verifyUserUseCase.execute(token);
        expect(verfyUserResult).toMatchObject({
            isErr: true,
            error: verify_token_error_1.VerifyTokenError.INVALID_TOKEN,
        });
    });
});
