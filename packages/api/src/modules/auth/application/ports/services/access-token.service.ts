import { AccessToken } from '@/modules/auth/domain/entities/access-token.entity';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';
import { VerifyTokenError } from '../../errors/verify-token.error';
import { Result } from '@/modules/shared/application/utils/result';

export type NewAccessTokenParams = {
  userId: string;
  issueAt: Date;
  device: string;
  ipAddr: string;
};
export interface AccessTokenService {
  issueNewAccessToken(
    newAccessToken: NewAccessTokenParams,
  ): Promise<AccessToken>;

  revokeToken(refreshToken: string): Promise<void>;

  find(token: string): Promise<UserToken | null>;

  createAccessToken(userId: string, token: string): Promise<string>;
  
  verifyAccessToken(
    token: string,
  ): Promise<Result<string, VerifyTokenError>>
}
