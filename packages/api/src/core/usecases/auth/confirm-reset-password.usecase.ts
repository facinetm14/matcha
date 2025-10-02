import { AccessToken } from '@/core/domain/entities/access-token.entity';
import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { injectable, inject } from 'inversify';

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
