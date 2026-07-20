import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { inject, injectable } from 'inversify';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { AccessToken } from '@/modules/auth/domain/entities/access-token.entity';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(
    refreshToken: string,
    ipAddr: string,
    device: string,
  ): Promise<Result<AccessToken, VerifyTokenError>> {
    const userToken = await this.accessTokenService.find(refreshToken);
    if (!userToken) {
      return Err(VerifyTokenError.INVALID_TOKEN);
    }

    const now = new Date();
    if (userToken.expireAt && userToken.expireAt <= now) {
      return Err(VerifyTokenError.TOKEN_EXPIRED);
    }

    if (userToken.ipAddr !== ipAddr && userToken.device !== device) {
      return Err(VerifyTokenError.UNKNOWN_CLIENT);
    }

    await this.accessTokenService.revokeToken(refreshToken);

    const newAccessToken = await this.accessTokenService.issueNewAccessToken({
      userId: userToken.userId,
      issueAt: now,
      device,
      ipAddr,
    });

    return Ok(newAccessToken);
  }
}
