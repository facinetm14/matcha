"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_CURRENT_USER_ID = void 0;
exports.factoryUser = factoryUser;
exports.factoryUserToken = factoryUserToken;
exports.factoryUserRepositoryInMemory = factoryUserRepositoryInMemory;
exports.factoryUserTokenRepositoryInMemory = factoryUserTokenRepositoryInMemory;
exports.factoryCreateUserDto = factoryCreateUserDto;
const user_status_enum_1 = require("../../users/application/consts/user-status.enum");
const uuid_1 = require("../../../../../shared/uuid");
const user_token_category_1 = require("../../auth/application/consts/user-token-category");
const user_repository_InMemory_1 = require("../../users/infrastructure/adapters/repositories/user-repository-InMemory");
const user_token_repository_inMemory_1 = require("../../auth/infrastructure/adapters/repositories/user-token-repository-inMemory");
exports.MOCK_CURRENT_USER_ID = 'user-id-1234';
function factoryUser(user) {
    const now = new Date();
    return {
        id: (0, uuid_1.uuid)(),
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        passwd: '',
        createdAt: now,
        updatedAt: now,
        status: user_status_enum_1.UserStatus.UNVERIFIED,
        isFirstLogin: 'yes',
        ...user,
    };
}
function factoryUserToken(userToken) {
    const now = new Date();
    return {
        id: (0, uuid_1.uuid)(),
        token: (0, uuid_1.uuid)(),
        category: user_token_category_1.UserTokenCateory.ONE_TIME,
        ipAddr: '',
        device: '',
        expireAt: null,
        createdAt: now,
        updatedAt: now,
        userId: '',
        ...userToken,
    };
}
function factoryUserRepositoryInMemory() {
    return new user_repository_InMemory_1.UserRepositoryInMemory();
}
function factoryUserTokenRepositoryInMemory() {
    return new user_token_repository_inMemory_1.UserTokenRepositoryInMemory();
}
function factoryCreateUserDto(createUserDto, { shouldMockId } = { shouldMockId: false }) {
    const now = new Date();
    return {
        id: shouldMockId ? exports.MOCK_CURRENT_USER_ID : (0, uuid_1.uuid)(),
        email: '',
        username: '',
        passwd: '',
        confirmPasswd: '',
        firstName: '',
        lastName: '',
        createdAt: now,
        updatedAt: now,
        ...createUserDto,
    };
}
