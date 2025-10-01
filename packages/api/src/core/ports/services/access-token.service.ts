import { AccessToken } from '@/core/domain/entities/access-token.entity';
import { UserToken } from '@/core/domain/entities/user-token.entity';

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

  revokeRefreshToken(refreshToken: string): Promise<void>;

  find(token: string): Promise<UserToken | null>;
}
