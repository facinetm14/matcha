import { LoginUserUseCase } from '../../../src/modules/auth/application/usecases/login-user.usecase';
import { UserRepository } from '../../../src/modules/users/application/ports/repositories/user.repository';
import { factoryUserToken } from '@/modules/shared/application/utils/factory';
import {
  factoryCreateUserDto,
  factoryUserRepositoryInMemory,
  factoryUserTokenRepositoryInMemory,
} from '../../support/factory';
import { CreateUserDto } from '../../../src/modules/auth/application/dto/create-user.dto';
import { UserStatus } from '../../../src/modules/users/domain/consts/user-status.enum';
import { UserTokenRepository } from '../../../src/modules/auth/application/ports/repositories/user-token.repository';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { IpLocation } from '@/modules/auth/application/ports/services/ip-location-service';
import { UserLocationRepository } from '@/modules/users/application/ports/repositories/user-location.repository';

describe('Login user usecase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let userRepository: UserRepository;
  let userTokenRepository: UserTokenRepository;
  let createUserDto: CreateUserDto;
  let accessTokenService: AccessTokenService;
  let ipLocation: IpLocation;
  let userLocationRepository: UserLocationRepository;

  const ipAddr = '';
  const device = '';

  beforeAll(() => {
    userRepository = factoryUserRepositoryInMemory();
    userTokenRepository = factoryUserTokenRepositoryInMemory();
    accessTokenService = {
      createAccessToken: jest.fn().mockResolvedValue('token'),
    } as unknown as AccessTokenService;
    ipLocation = {
      getLocation: jest.fn().mockResolvedValue({
        lat: 0,
        lng: 0,
        city: 'Paris',
        isEnabledByUser: false,
      }),
    } as unknown as IpLocation;
    userLocationRepository = {
      findByUserId: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as UserLocationRepository;

    createUserDto = factoryCreateUserDto({
      username: 'user-blabla',
      passwd: 'user-blabla-Strong**',
    });

    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      userTokenRepository,
      accessTokenService,
      ipLocation,
      userLocationRepository,
    );
  });

  test('should return error when credentials are invalid', async () => {
    const loginResult = await loginUserUseCase.execute(
      {
        username: createUserDto.username,
        passwd: 'wrong pass',
      },
      device,
      ipAddr,
    );

    accessTokenService.createAccessToken = jest
      .fn()
      .mockReturnValue(factoryUserToken({}));

    expect(loginResult).toMatchObject({
      isErr: true,
      error: expect.any(String),
    });
  });

  test('should return error when user is unverified even if credentials are valid', async () => {
    await userRepository.create(createUserDto);

    const loginUserResult = await loginUserUseCase.execute(
      {
        username: createUserDto.username,
        passwd: createUserDto.passwd,
      },
      device,
      ipAddr,
    );

    expect(loginUserResult).toMatchObject({
      isErr: true,
      error: expect.any(String),
    });
  });

  test('should return ok when user is verified and credentials are valid', async () => {
    await userRepository.update(createUserDto.id, {
      status: UserStatus.VERIFIED,
    });

    const loginUserResult = await loginUserUseCase.execute(
      {
        username: createUserDto.username,
        passwd: createUserDto.passwd,
      },
      device,
      ipAddr,
    );

    expect(loginUserResult).toMatchObject({
      isErr: false,
    });
  });
});
