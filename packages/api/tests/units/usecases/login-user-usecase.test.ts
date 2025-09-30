import { LoginUserUseCase } from '../../../src/core/usecases/auth/login-user.usecase';
import { UserRepository } from '../../../src/core/ports/repositories/user.repository';
import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
  factoryUserTokenRepositoryInMemory,
} from '../../../../shared/factory';
import { CreateUserDto } from '../../../src/core/domain/dto/create-user.dto';
import { UserStatus } from '../../../src/core/domain/enums/user-status.enum';
import { UserTokenRepository } from '../../../src/core/ports/repositories/user-token.repository';

describe('Login user usecase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let userRepository: UserRepository;
  let userTokenRepository: UserTokenRepository;
  let createUserDto: CreateUserDto;
  const ipAddr = '';
  const device = '';

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    userTokenRepository = factoryUserTokenRepositoryInMemory();

    createUserDto = factoryCreateUserDto({
      username: 'user-blabla',
      passwd: 'user-blabla-Strong**',
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
    }, device, ipAddr);

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
    }, device, ipAddr);

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
    }, device, ipAddr);

    expect(loginUserResult).toMatchObject({
      isErr: false,
    });
  });
});
