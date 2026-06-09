"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_status_enum_1 = require("../../../src/modules/users/application/consts/user-status.enum");
const get_current_user_usecase_1 = require("../../../src/modules/users/application/usecases/get-current-user.usecase");
const factory_1 = require("../../../src/modules/shared/utils/factory");
describe('Get current user usecase', () => {
    let getCurrentUserUseCase;
    let userRepository;
    let createUserDto;
    let eventBus;
    beforeAll(() => {
        userRepository = (0, factory_1.factoryUserRepositoryInMemory)();
        eventBus = {};
        getCurrentUserUseCase = new get_current_user_usecase_1.GetCurrentUserUseCase(userRepository, eventBus);
        createUserDto = (0, factory_1.factoryCreateUserDto)({
            username: 'user-blabla',
            passwd: 'user-blabla-Strong**',
            email: 'blabla@gmail.com',
            firstName: 'toto',
            lastName: 'tata',
        }, { shouldMockId: true });
    });
    test('should return error when user is not valid', async () => {
        const getCurrentUserResult = await getCurrentUserUseCase.execute('invalid user');
        expect(getCurrentUserResult).toMatchObject({
            isErr: true,
        });
    });
    test('should return a valid user with first login yes', async () => {
        await userRepository.create(createUserDto);
        await userRepository.update(createUserDto.id, {
            status: user_status_enum_1.UserStatus.VERIFIED,
        });
        const getCurrentUserResult = await getCurrentUserUseCase.execute(createUserDto.id);
        expect(getCurrentUserResult).toMatchObject({
            isErr: false,
            data: {
                isFirstLogin: 'yes',
            },
        });
    });
    test('should return a valid user with firstlogin null', async () => {
        const getCurrentUserResult = await getCurrentUserUseCase.execute(createUserDto.id);
        expect(getCurrentUserResult).toMatchObject({
            isErr: false,
            data: {
                isFirstLogin: null,
            },
        });
    });
});
