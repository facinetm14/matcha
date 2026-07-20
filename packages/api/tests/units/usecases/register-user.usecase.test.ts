import { describe, expect, test } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/modules/auth/application/usecases/register-user.usecase';
import { UserRepository } from '../../../src/modules/users/application/ports/repositories/user.repository';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { PasswordHasher } from '@/modules/auth/application/ports/services/password-hasher';
import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
} from '../../support/factory';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

describe('User Registration', () => {
  let userRepository: UserRepository;
  let registerUserUseCase: RegisterUserUseCase;
  let eventBus: EventBus;
  const ipAddr = '';
  const device = '';

  beforeAll(() => {
    const logger = container.get<Logger>(TYPE.Logger);
    userRepository = factoryUserRepositoryInMemory();

    eventBus = container.get<EventBus>(TYPE.EventBus);
    const passwordHasher = container.get<PasswordHasher>(TYPE.PasswordHasher);

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      logger,
      eventBus,
      passwordHasher,
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
      ipAddr,
      device,
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
      ipAddr,
      device,
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
      ipAddr,
      device,
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
      ipAddr,
      device,
    );

    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });
});
