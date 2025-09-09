import { describe, expect, test } from '@jest/globals';
import { RegisterUserUseCase } from '../../../src/core/usecases/auth/register-user.usecase';
import { UserRepository } from '../../../src/core/ports/repositories/user.repository';
import container from '../../../src/infrastructure/config/inversify';
import { TYPE } from '../../../src/infrastructure/config/inversify-type';
import { Logger } from '../../../src/core/ports/services/logger.service';
import { CreateUserDto } from '../../../src/core/domain/dto/create-user.dto';
import { EventBus } from '../../../src/core/ports/services/event-bus';
import { uuid } from '../../../../shared/uuid';

describe('User Registration', () => {
  let userRepository: UserRepository;
  let registerUserUseCase: RegisterUserUseCase;
  let eventBus: EventBus;

  beforeAll(() => {
    const logger = container.get<Logger>(TYPE.Logger);
    userRepository = container.get<UserRepository>(TYPE.UserRepository);
    eventBus = container.get<EventBus>(TYPE.EventBus);

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      logger,
      eventBus,
    );
  });

  test('should register user and return its id', async () => {
    const id = uuid();
    const createUserDto: CreateUserDto = {
      id,
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    };
    userRepository.findUserByUniqKey = jest.fn().mockResolvedValue(null);
    userRepository.create = jest.fn().mockResolvedValue(id);

    const userRegister = await registerUserUseCase.execute(createUserDto);
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(id);
  });

  test('should not register user with existing username', async () => {
    const id = uuid();
    const createUserDto: CreateUserDto = {
      id,
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    };
    userRepository.findUserByUniqKey = jest
      .fn()
      .mockResolvedValue({ username: 'testing-happy' });

    const userRegister = await registerUserUseCase.execute(createUserDto);
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });

  test('should not register user with existing email', async () => {
    const id = uuid();
    const createUserDto: CreateUserDto = {
      id,
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'Allt.xp-c0hrhhn@yopmail.com',
      confirmPasswd: 'Allt.xp-c0hrhhn@yopmail.com',
      firstName: 'toto',
      lastName: 'tata',
    };
    userRepository.findUserByUniqKey = jest
      .fn()
      .mockResolvedValue({ email: 'blabla@gmail.com' });

    const userRegister = await registerUserUseCase.execute(createUserDto);
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });

  test('should not register user with weak password', async () => {
    const id = uuid();
    const createUserDto: CreateUserDto = {
      id,
      email: 'blabla@gmail.com',
      username: 'testing-happy',
      passwd: 'weak passwd',
      confirmPasswd: 'weak passwd',
      firstName: 'toto',
      lastName: 'tata',
    };

    userRepository.findUserByUniqKey = jest.fn().mockResolvedValue(null);

    const userRegister = await registerUserUseCase.execute(createUserDto);
    const newUserId = userRegister.isErr ? null : userRegister.data;

    expect(newUserId).toBe(null);
  });
});
