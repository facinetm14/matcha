"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const register_user_usecase_1 = require("../../../src/modules/auth/application/usecases/register-user.usecase");
const user_token_category_1 = require("../../../src/modules/auth/application/consts/user-token-category");
const factory_1 = require("../../../src/modules/shared/utils/factory");
const inversify_1 = __importDefault(require("../../../src/config/ioc/inversify"));
const inversify_type_1 = require("../../../src/config/ioc/inversify-type");
(0, globals_1.describe)('User Registration', () => {
    let userRepository;
    let registerUserUseCase;
    let eventBus;
    let userToken;
    beforeAll(() => {
        const logger = inversify_1.default.get(inversify_type_1.TYPE.Logger);
        userRepository = (0, factory_1.factoryUserRepositoryInMemory)();
        eventBus = inversify_1.default.get(inversify_type_1.TYPE.EventBus);
        const now = new Date();
        userToken = (0, factory_1.factoryUserToken)({
            userId: '',
            category: user_token_category_1.UserTokenCateory.ONE_TIME,
            expireAt: null,
            ipAddr: '',
            device: '',
            createdAt: now,
            updatedAt: now,
        });
        registerUserUseCase = new register_user_usecase_1.RegisterUserUseCase(userRepository, logger, eventBus);
    });
    (0, globals_1.test)('should register user and return its id', async () => {
        const createUserDto = (0, factory_1.factoryCreateUserDto)({
            email: 'blabla@gmail.com',
            username: 'testing-happy',
            passwd: 'Allt.xp-c0hrhhn@yopmail.com',
            confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
            firstName: 'toto',
            lastName: 'tata',
        });
        const userRegister = await registerUserUseCase.execute(createUserDto, userToken);
        const newUserId = userRegister.isErr ? null : userRegister.data;
        (0, globals_1.expect)(newUserId).toBeTruthy();
    });
    (0, globals_1.test)('should not register user with existing username', async () => {
        const createUserDto = (0, factory_1.factoryCreateUserDto)({
            email: 'blabla@gmail.com',
            username: 'testing-happy',
            passwd: 'Allt.xp-c0hrhhn@yopmail.com',
            confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
            firstName: 'toto',
            lastName: 'tata',
        });
        const userRegister = await registerUserUseCase.execute(createUserDto, userToken);
        const newUserId = userRegister.isErr ? null : userRegister.data;
        (0, globals_1.expect)(newUserId).toBe(null);
    });
    (0, globals_1.test)('should not register user with existing email', async () => {
        const createUserDto = (0, factory_1.factoryCreateUserDto)({
            email: 'blabla@gmail.com',
            username: 'testing-happy',
            passwd: 'Allt.xp-c0hrhhn@yopmail.com',
            confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
            firstName: 'toto',
            lastName: 'tata',
        });
        const userRegister = await registerUserUseCase.execute(createUserDto, userToken);
        const newUserId = userRegister.isErr ? null : userRegister.data;
        (0, globals_1.expect)(newUserId).toBe(null);
    });
    (0, globals_1.test)('should not register user with weak password', async () => {
        const createUserDto = (0, factory_1.factoryCreateUserDto)({
            email: 'blabla@gmail.com',
            username: 'testing-happy',
            passwd: 'weak passwd',
            confirmPasswd: 'weak passwd',
            firstName: 'toto',
            lastName: 'tata',
        });
        userRepository.findUserByUniqKey = jest.fn().mockResolvedValue(null);
        const userRegister = await registerUserUseCase.execute(createUserDto, userToken);
        const newUserId = userRegister.isErr ? null : userRegister.data;
        (0, globals_1.expect)(newUserId).toBe(null);
    });
});
