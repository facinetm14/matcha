import {
  AccessTokenService,
  NewAccessTokenParams,
} from '@/modules/auth/application/ports/services/access-token.service';
import { AccessToken } from '@/modules/auth/domain/entities/access-token.entity';
import { injectable, inject } from 'inversify';
import { UserTokenRepository } from '@/modules/auth/application/ports/repositories/user-token.repository';
import { factoryUserToken } from '@/modules/shared/utils/factory';
import { UserTokenCateory } from '@/modules/auth/application/consts/user-token-category';
import {
  ACCESS_TOKEN_TTL_IN_MIN,
  REFRESH_ACESS_TOKEN_TTL_IN_MS,
} from '@/modules/auth/application/consts/access-token-ttl';
import { SignJWT, jwtVerify } from 'jose';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { Err, Ok, Result } from '@/modules/shared/utils/result';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

@injectable()
export class AccessTokenManager implements AccessTokenService {
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
    const token = await this.createAccessToken(
      userToken.userId,
      userToken.token,
    );

    return { token, refresh };
  }

  async revokeToken(refreshToken: string): Promise<void> {
    await this.userTokenRepository.delete(refreshToken);
  }

  async find(token: string): Promise<UserToken | null> {
    return this.userTokenRepository.findById(token);
  }

  async createAccessToken(userId: string, token: string): Promise<string> {
    return new SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_TTL_IN_MIN)
      .setJti(token)
      .sign(key);
  }

  async verifyAccessToken(
    token: string,
  ): Promise<Result<string, VerifyTokenError>> {
    try {
      const { payload } = await jwtVerify(token, key);
      if (payload && payload.sub) {
        return Ok(payload.sub as string);
      }
      return Err(VerifyTokenError.INVALID_TOKEN);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return Err(VerifyTokenError.TOKEN_EXPIRED);
    }
  }
}
