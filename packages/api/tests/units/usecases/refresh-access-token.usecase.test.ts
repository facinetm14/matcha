import { AccessTokenManager } from '@/modules/auth/infrastructure/adapters/services/access-token-manager';
import { REFRESH_ACESS_TOKEN_TTL_IN_MS } from '@/modules/auth/application/consts/access-token-ttl';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { RefreshAccessTokenUseCase } from '@/modules/auth/application/usecases/refresh-token.usecase';
import { factoryUserTokenRepositoryInMemory } from '@/modules/shared/utils/factory';

describe('Refresh Access Token Usecase', () => {
  let refreshAccessTokenUseCase: RefreshAccessTokenUseCase;
  let accessTokenService: AccessTokenService;
  const ipAddr = '00000';
  const device = 'test-device';
  const userId = 'user-id';

  beforeAll(async () => {
    accessTokenService = new AccessTokenManager(
      factoryUserTokenRepositoryInMemory(),
    );

    refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
      accessTokenService,
    );
  });

  test('should return error when refresh token is invalid', async () => {
    const refreshTokenResult = await refreshAccessTokenUseCase.execute(
      'invalid-token',
      ipAddr,
      device,
    );

    expect(refreshTokenResult).toMatchObject({
      isErr: true,
      error: VerifyTokenError.INVALID_TOKEN,
    });
  });

  test('should return error when refresh token is expired', async () => {
    const now = new Date();
    const accessToken = await accessTokenService.issueNewAccessToken({
      userId,
      issueAt: new Date(now.getTime() - REFRESH_ACESS_TOKEN_TTL_IN_MS),
      device,
      ipAddr,
    });

    const refreshTokenResult = await refreshAccessTokenUseCase.execute(
      accessToken.refresh,
      ipAddr,
      device,
    );

    expect(refreshTokenResult).toMatchObject({
      isErr: true,
      error: VerifyTokenError.TOKEN_EXPIRED,
    });
  });

  test('should return error when client ip and device change even if token is valid', async () => {
    const accessToken = await accessTokenService.issueNewAccessToken({
      userId,
      issueAt: new Date(),
      device,
      ipAddr,
    });

    const refreshTokenResult = await refreshAccessTokenUseCase.execute(
      accessToken.refresh,
      'different-ip',
      'diffrent-device',
    );

    expect(refreshTokenResult).toMatchObject({
      isErr: true,
      error: VerifyTokenError.UNKNOWN_CLIENT,
    });
  });

  test('should return ok, when refreshtoken is valid and ip or device match', async () => {
    const accessToken = await accessTokenService.issueNewAccessToken({
      userId,
      issueAt: new Date(),
      device,
      ipAddr,
    });

    const refreshTokenResult = await refreshAccessTokenUseCase.execute(
      accessToken.refresh,
      ipAddr,
      device,
    );

    expect(refreshTokenResult).toMatchObject({
      isErr: false,
    });
  });
});
