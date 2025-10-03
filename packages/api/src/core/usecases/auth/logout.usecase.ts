import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
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
