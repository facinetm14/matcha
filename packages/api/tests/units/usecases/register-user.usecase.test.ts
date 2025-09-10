import { describe, expect, test } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/core/usecases/auth/register-user.usecase';
import { UserRepository } from '../../../src/core/ports/repositories/user.repository';
import container from '../../../src/infrastructure/config/inversify';
import { TYPE } from '../../../src/infrastructure/config/inversify-type';
import { Logger } from '../../../src/core/ports/services/logger.service';
import { EventBus } from '../../../src/core/ports/services/event-bus';
import { uuid } from '../../../../shared/uuid';
import { UserToken } from '../../../src/core/domain/entities/user-token.entity';
import { UserTokenCateory } from '../../../src/core/domain/enums/user-token-category';

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
    userToken = {
      id: uuid(),
      token: uuid(),
      userId: '',
      category: UserTokenCateory.ONE_TIME,
      expireAt: null,
      ipAddr: '',
      device: '',
      createdAt: now,
      updatedAt: now,
    };

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

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );

    const userRegister = await registerUserUseCase.execute(
      createUserDto,
      userToken,
    );
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });
});
