"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_user_usecase_1 = require("../../../src/modules/auth/application/usecases/login-user.usecase");
const factory_1 = require("../../../src/modules/shared/utils/factory");
const user_status_enum_1 = require("../../../src/modules/users/application/consts/user-status.enum");
describe('Login user usecase', () => {
    let loginUserUseCase;
    let userRepository;
    let userTokenRepository;
    let createUserDto;
    let accessTokenService;
    let ipLocation;
    let userLocationRepository;
    const ipAddr = '';
    const device = '';
    beforeAll(() => {
        userRepository = (0, factory_1.factoryUserRepositoryInMemory)();
        userTokenRepository = (0, factory_1.factoryUserTokenRepositoryInMemory)();
        accessTokenService = {
            createAccessToken: jest.fn().mockResolvedValue('token'),
        };
        ipLocation = {
            getLocation: jest.fn().mockResolvedValue({
                lat: 0,
                lng: 0,
                city: 'Paris',
                isEnabledByUser: false,
            }),
        };
        userLocationRepository = {
            findByUserId: jest.fn().mockResolvedValue(null),
            create: jest.fn(),
            update: jest.fn(),
        };
        createUserDto = (0, factory_1.factoryCreateUserDto)({
            username: 'user-blabla',
            passwd: 'user-blabla-Strong**',
        });
        loginUserUseCase = new login_user_usecase_1.LoginUserUseCase(userRepository, userTokenRepository, accessTokenService, ipLocation, userLocationRepository);
    });
    test('should return error when credentials are invalid', async () => {
        const loginResult = await loginUserUseCase.execute({
            username: createUserDto.username,
            passwd: 'wrong pass',
        }, device, ipAddr);
        accessTokenService.createAccessToken = jest
            .fn()
            .mockReturnValue((0, factory_1.factoryUserToken)({}));
        expect(loginResult).toMatchObject({
            isErr: true,
            error: expect.any(String),
        });
    });
    test('should return error when user is unverified even if credentials are valid', async () => {
        await userRepository.create(createUserDto);
        const loginUserResult = await loginUserUseCase.execute({
            username: createUserDto.username,
            passwd: createUserDto.passwd,
        }, device, ipAddr);
        expect(loginUserResult).toMatchObject({
            isErr: true,
            error: expect.any(String),
        });
    });
    test('should return ok when user is verified and credentials are valid', async () => {
        await userRepository.update(createUserDto.id, {
            status: user_status_enum_1.UserStatus.VERIFIED,
        });
        const loginUserResult = await loginUserUseCase.execute({
            username: createUserDto.username,
            passwd: createUserDto.passwd,
        }, device, ipAddr);
        expect(loginUserResult).toMatchObject({
            isErr: false,
        });
    });
});
