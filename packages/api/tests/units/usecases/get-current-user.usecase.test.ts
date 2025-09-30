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

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  });

  test('should return error when token is invalid', async () => {
    const getCurrentUserResult =
      await getCurrentUserUseCase.execute('invalid token');

    expect(getCurrentUserResult).toMatchObject({
      isErr: true,
    });
  });

  test('should return a valid user', async () => {
    // Arrange
    const createUserDto = factoryCreateUserDto(
      {
        username: 'user-blabla',
        passwd: 'user-blabla-Strong**',
        email: 'blabla@gmail.com',
        firstName: 'toto',
        lastName: 'tata',
      },
      { shouldMockId: true },
    );

    await userRepository.create(createUserDto);
    await userRepository.update(createUserDto.id, {
      status: UserStatus.VERIFIED,
    });

    const getCurrentUserResult =
      await getCurrentUserUseCase.execute('valid token');

    expect(getCurrentUserResult).toMatchObject({
      isErr: false,
    });
  });
});
