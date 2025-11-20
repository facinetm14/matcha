import { UserToken } from '../../domain/entities/user-token.entity';

export interface UserTokenRepository {
  create(createUserToken: UserToken): Promise<string | null>;
  findById(id: string): Promise<UserToken | null>;
  delete(id: string): Promise<void>;
}
