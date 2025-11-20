import { describe, expect, test } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/modules/auth/application/usecases/register-user.usecase';
import { UserRepository } from '../../../src/modules/users/application/ports/repositories/user.repository';
import { Logger } from '../../../src/modules/shared/ports/logger.service';
import { EventBus } from '../../../src/modules/shared/ports/event-bus';
import { UserTokenCateory } from '../../../src/modules/auth/application/consts/user-token-category';
import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
  factoryUserToken,
} from '../../../src/modules/shared/utils/factory';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

describe('User Registration', () => {
  let userRepository: UserRepository;
  let registerUserUseCase: RegisterUserUseCase;
  let eventBus: EventBus;
  let userToken: UserToken;

  beforeAll(() => {
    const logger = container.get<Logger>(TYPE.Logger);
    userRepository = factoryUserRepositoryInMemory();

    eventBus = container.get<EventBus>(TYPE.EventBus);
    const now = new Date();
    userToken = factoryUserToken({
      userId: '',
      category: UserTokenCateory.ONE_TIME,
      expireAt: null,
      ipAddr: '',
      device: '',
      createdAt: now,
      updatedAt: now,
    });

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      logger,
      eventBus,
    );
  });

  test('should register user and return its id', async () => {
    const createUserDto = factoryCreateUserDto({
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    });

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBeTruthy();
  });

  test('should not register user with existing username', async () => {
    const createUserDto = factoryCreateUserDto({
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    });

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });

  test('should not register user with existing email', async () => {
    const createUserDto = factoryCreateUserDto({
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    });

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });

  test('should not register user with weak password', async () => {
    const createUserDto = factoryCreateUserDto({
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'weak passwd',
      confirmPasswd: 'weak passwd',
      firstName: 'toto',
      lastName: 'tata',
    });

    userRepository.findUserByUniqKey = jest.fn().mockResolvedValue(null);

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );

    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });
});
