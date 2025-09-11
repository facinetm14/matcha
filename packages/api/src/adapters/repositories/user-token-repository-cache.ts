import { UserToken } from '../../core/domain/entities/user-token.entity';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';
import { inject, injectable } from 'inversify';
import { CacheService } from '../../core/ports/services/cache.service';
import { TYPE } from '../../infrastructure/config/inversify-type';
import { CacheResourceKeys } from '../../core/domain/consts/cache-resource-keys';

@injectable()
export class UserTokenRepositoryInCache implements UserTokenRepository {
  constructor(
    @inject(TYPE.CacheService) private readonly cacheService: CacheService,
  ) {}

  create(createUserToken: UserToken): Promise<string | null> {
    return this.cacheService.insert<UserToken>(
      CacheResourceKeys.USER_TOKENS,
      createUserToken,
    );
  }

  findById(id: string): Promise<UserToken | null> {
    return this.cacheService.findById<UserToken>(
      CacheResourceKeys.USER_TOKENS,
      id,
    );
  }

  delete(id: string): Promise<void> {
    return this.cacheService.delete(CacheResourceKeys.USER_TOKENS, id);
  }
}
