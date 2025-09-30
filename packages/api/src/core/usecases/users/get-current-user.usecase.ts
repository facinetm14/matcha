import { User } from '../../domain/entities/user.entity';
import { Err, Ok, Result } from '../../domain/utils/result';
import { VerifyTokenError } from '../../domain/errors/verify-token.error';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';
import { verifyAccessToken } from '../../../infrastructure/utils/jwt';

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(accessToken: string): Promise<Result<User, VerifyTokenError>> {
    const verifyAccessTokenResult = await verifyAccessToken(accessToken);

    if (verifyAccessTokenResult.isErr) {
      return Err(VerifyTokenError.INVALID_TOKEN);
    }

    const userId = verifyAccessTokenResult.data;
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
