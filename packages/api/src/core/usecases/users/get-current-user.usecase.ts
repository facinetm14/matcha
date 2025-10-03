import { User } from '../../domain/entities/user.entity';
import { Err, Ok, Result } from '../../domain/utils/result';
import { VerifyTokenError } from '../../domain/errors/verify-token.error';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';
import { AccessTokenService } from '@/core/ports/services/access-token.service';

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(userId: string): Promise<Result<User, VerifyTokenError>> {
    const user = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      userId,
    );

    if (!user) {
      return Err(VerifyTokenError.USER_NOT_FOUND);
    }

    return Ok(user);
  }
}
