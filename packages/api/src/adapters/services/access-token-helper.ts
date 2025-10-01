import {
  AccessTokenService,
  NewAccessTokenParams,
} from '@/core/ports/services/access-token.service';
import { AccessToken } from '@/core/domain/entities/access-token.entity';
import { injectable, inject } from 'inversify';
import { UserTokenRepository } from '@/core/ports/repositories/user-token.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { factoryUserToken } from '@shared/factory';
import { createAccessToken } from '@/infrastructure/utils/jwt';
import { UserTokenCateory } from '@/core/domain/enums/user-token-category';
import { REFRESH_ACESS_TOKEN_TTL_IN_MS } from '@/core/domain/consts/access-token-ttl';
import { UserToken } from '@/core/domain/entities/user-token.entity';

@injectable()
export class AccessTokenHelper implements AccessTokenService {
  constructor(
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
  ) {}

  async issueNewAccessToken(
    newAccessToken: NewAccessTokenParams,
  ): Promise<AccessToken> {
    const userToken = factoryUserToken({
      userId: newAccessToken.userId,
      category: UserTokenCateory.SESSION,
      expireAt: new Date(
        newAccessToken.issueAt.getTime() + REFRESH_ACESS_TOKEN_TTL_IN_MS,
      ),
      createdAt: newAccessToken.issueAt,
      updatedAt: newAccessToken.issueAt,
      device: newAccessToken.device,
      ipAddr: newAccessToken.ipAddr,
    });

    await this.userTokenRepository.create(userToken);

    const refresh = userToken.id;
    const token = await createAccessToken(userToken.userId, userToken.token);

    return { token, refresh };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.userTokenRepository.delete(refreshToken);
  }

  async find(token: string): Promise<UserToken | null> {
    return this.userTokenRepository.findById(token);
  }
}
