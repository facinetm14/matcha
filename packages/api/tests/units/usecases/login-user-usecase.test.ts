import { describe, test } from '@jest/globals';
import { LoginUserUseCase } from '../../../src/core/usecases/auth/login-user.usecase';
import { UserRepository } from '../../../src/core/ports/repositories/user.repository';
import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
  factoryUserToken,
  factoryUserTokenRepositoryInMemory,
} from '../../../../shared/factory';
import { CreateUserDto } from '../../../src/core/domain/dto/create-user.dto';
import { UserStatus } from '../../../src/core/domain/enums/user-status.enum';
import { UserTokenRepository } from '../../../src/core/ports/repositories/user-token.repository';
import { UserToken } from '../../../src/core/domain/entities/user-token.entity';
import { UserTokenCateory } from '../../../src/core/domain/enums/user-token-category';

describe('Login user usecase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let userRepository: UserRepository;
  let userTokenRepository: UserTokenRepository;
  let createUserDto: CreateUserDto;
  let userToken: UserToken;

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    userTokenRepository = factoryUserTokenRepositoryInMemory();

    createUserDto = factoryCreateUserDto({
      username: 'user-blabla',
      passwd: 'user-blabla-Strong**',
    });

    userToken = factoryUserToken({
      userId: createUserDto.id,
      category: UserTokenCateory.SESSION,
    });

    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      userTokenRepository,
    );
  });

  test('should return error when credentials are invalid', async () => {
    const loginResult = await loginUserUseCase.execute({
      username: createUserDto.username,
      passwd: 'wrong pass',
    }, userToken);

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
    }, userToken);

    expect(loginUserResult).toMatchObject({
      isErr: true,
      error: expect.any(String),
    });
  });

  test('should return ok when user is verified and credentials are valid', async () => {
    await userRepository.update(createUserDto.id, {
      status: UserStatus.VERIFIED,
    });

    const loginUserResult = await loginUserUseCase.execute({
      username: createUserDto.username,
      passwd: createUserDto.passwd,
    }, userToken);

    expect(loginUserResult).toMatchObject({
      isErr: false,
    });
  });

  test('should issue a session user token ', async () => {
    const loginUserResult = await loginUserUseCase.execute({
      username: createUserDto.username,
      passwd: createUserDto.passwd,
    }, userToken);

    expect(loginUserResult).toMatchObject({
      isErr: false,
    });
  });
});
