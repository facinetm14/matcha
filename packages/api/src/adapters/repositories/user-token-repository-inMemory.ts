import { factoryUserToken } from '../../../../shared/factory';
import { UserToken } from '../../core/domain/entities/user-token.entity';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';

export class UserTokenRepositoryInMemory implements UserTokenRepository {
  private usersTokens: UserToken[];

  constructor() {
    this.usersTokens = [];
  }

  async create(createUserToken: UserToken): Promise<string | null> {
    this.usersTokens.push(factoryUserToken({ ...createUserToken }));
    return createUserToken.id;
  }

  async findByToken(token: string): Promise<UserToken | null> {
    return (
      this.usersTokens.find((userToken) => userToken.token === token) ?? null
    );
  }

  async delete(id: string): Promise<void> {
    const currentUsersToken = structuredClone(this.usersTokens);
    this.usersTokens = currentUsersToken.filter(
      (userToken) => userToken.id !== id,
    );
  }
}
