import { UserTokenRepository } from '../../../application/ports/repositories/user-token.repository';
import { inject, injectable } from 'inversify';
import { CacheService } from '@/modules/shared/application/ports/services/cache.service';
import { CacheResourceKeys } from '@/modules/shared/application/consts/cache-ressource-keys';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';
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
