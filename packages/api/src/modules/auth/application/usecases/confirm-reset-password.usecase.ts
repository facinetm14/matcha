import { AccessToken } from '@/modules/auth/domain/entities/access-token.entity';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { injectable, inject } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class ConfrimResetPasswordUseCase {
  constructor(
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(
    token: string,
    ipAddr: string,
    device: string,
  ): Promise<Result<AccessToken, VerifyTokenError>> {
    const userToken = await this.accessTokenService.find(token);
    if (!userToken) {
      return Err(VerifyTokenError.INVALID_TOKEN);
    }

    await this.accessTokenService.revokeToken(token);
    const newAccessToken = await this.accessTokenService.issueNewAccessToken({
      ipAddr,
      device,
      userId: userToken.userId,
      issueAt: new Date(),
    });

    return Ok(newAccessToken);
  }
}
