import { TYPE } from '@/config/ioc/inversify-type';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { injectable, inject } from 'inversify';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }
    return this.accessTokenService.revokeToken(refreshToken);
  }
}
