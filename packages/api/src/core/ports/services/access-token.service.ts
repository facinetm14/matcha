import { AccessToken } from '@/core/domain/entities/access-token.entity';
import { UserToken } from '@/core/domain/entities/user-token.entity';

export interface AccessTokenService {
  issueNewAccessToken(
    userId: string,
    issueAt: Date,
    device: string,
    ipAddr: string,
  ): Promise<AccessToken>;

  revokeRefreshToken(refreshToken: string): Promise<void>;

  find(token: string): Promise<UserToken | null>;
}
