import { UserToken } from '../../domain/entities/user-token.entity';

export interface UserTokenRepository {
  create(createUserToken: UserToken): Promise<string | null>;
  findByToken(token: string): Promise<UserToken | null>;
}
