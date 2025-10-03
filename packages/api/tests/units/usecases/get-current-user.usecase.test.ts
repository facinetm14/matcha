import { UserStatus } from '@/core/domain/enums/user-status.enum';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import container from '@/infrastructure/config/inversify';
import { TYPE } from '@/infrastructure/config/inversify-type';

import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
} from '@shared/factory';

describe('Get current user usecase', () => {
  let getCurrentUserUseCase: GetCurrentUserUseCase;
  let userRepository: UserRepository;
  let accessTokenService: AccessTokenService;

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    accessTokenService = container.get<AccessTokenService>(
      TYPE.AccessTokenService,
    );

    getCurrentUserUseCase = new GetCurrentUserUseCase(
      userRepository,
      accessTokenService,
    );
  });

  test('should return error when user is not valid', async () => {
    const getCurrentUserResult =
      await getCurrentUserUseCase.execute('invalid user');

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
      await getCurrentUserUseCase.execute(createUserDto.id);

    expect(getCurrentUserResult).toMatchObject({
      isErr: false,
    });
  });
});
