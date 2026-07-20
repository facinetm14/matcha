import { VerifyTokenError } from '../errors/verify-token.error';
import { Ok, Result, Err } from '@/modules/shared/application/utils/result';
import { inject, injectable } from 'inversify';
import { UserTokenRepository } from '../ports/repositories/user-token.repository';
import { UserRepository } from '../../../users/application/ports/repositories/user.repository';
import { UserStatus } from '../../../users/domain/consts/user-status.enum';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class VerifyUserUseCase {
  constructor(
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    validationToken: string,
  ): Promise<Result<null, VerifyTokenError>> {
    const existingToken =
      await this.userTokenRepository.findById(validationToken);

    if (!existingToken) {
      return Err(VerifyTokenError.INVALID_TOKEN);
    }

    await this.userRepository.update(existingToken.userId, {
      status: UserStatus.VERIFIED,
      updatedAt: new Date(),
    });

    await this.userTokenRepository.delete(existingToken.id);
    return Ok(null);
  }
}
