import { CreateUserDto } from '@/core/domain/dto/create-user.dto';
import { UserStatus } from '@/core/domain/enums/user-status.enum';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';

import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
} from '@shared/factory';

describe('Get current user usecase', () => {
  let getCurrentUserUseCase: GetCurrentUserUseCase;
  let userRepository: UserRepository;
  let createUserDto: CreateUserDto;

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();

    getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

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
        user: {
          isFirstLogin: 'yes',
        },
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
        user: {
          isFirstLogin: null,
        },
      },
    });
  });
});
