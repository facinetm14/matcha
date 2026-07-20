import { CreateUserDto } from '@/modules/auth/application/dto/create-user.dto';
import { UserStatus } from '@/modules/users/domain/consts/user-status.enum';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { GetCurrentUserUseCase } from '@/modules/users/application/usecases/get-current-user.usecase';

import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
} from '../../support/factory';

describe('Get current user usecase', () => {
  let getCurrentUserUseCase: GetCurrentUserUseCase;
  let userRepository: UserRepository;
  let createUserDto: CreateUserDto;
  let eventBus: EventBus;

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    eventBus = {} as EventBus;

    getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository, eventBus);

    createUserDto = factoryCreateUserDto(
      {
        username: 'user-blabla',
        passwd: 'user-blabla-Strong**',
        email: 'blabla@gmail.com',
        firstName: 'toto',
        lastName: 'tata',
      },
      { shouldMockId: true },
    );
  });

  test('should return error when user is not valid', async () => {
    const getCurrentUserResult =
      await getCurrentUserUseCase.execute('invalid user');

    expect(getCurrentUserResult).toMatchObject({
      isErr: true,
    });
  });

  test('should return a valid user with first login yes', async () => {
    await userRepository.create(createUserDto);
    await userRepository.update(createUserDto.id, {
      status: UserStatus.VERIFIED,
    });

    const getCurrentUserResult = await getCurrentUserUseCase.execute(
      createUserDto.id,
    );

    expect(getCurrentUserResult).toMatchObject({
      isErr: false,
      data: {
        isFirstLogin: 'yes',
      },
    });
  });

  test('should return a valid user with firstlogin null', async () => {
    const getCurrentUserResult = await getCurrentUserUseCase.execute(
      createUserDto.id,
    );

    expect(getCurrentUserResult).toMatchObject({
      isErr: false,
      data: {
        isFirstLogin: null,
      },
    });
  });
});
