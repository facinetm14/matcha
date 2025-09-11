import { TYPE } from '../../../infrastructure/config/inversify-type';
import { VerifyToken } from '../../domain/errors/verify-token.error';
import { Err, Ok, Result } from '../../domain/utils/result';
import { inject, injectable } from 'inversify';
import { UserTokenRepository } from '../../ports/repositories/user-token.repository';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserStatus } from '../../domain/enums/user-status.enum';

@injectable()
export class VerifyUserUseCase {
  constructor(
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(validationToken: string): Promise<Result<null, VerifyToken>> {
    const existingToken =
      await this.userTokenRepository.findById(validationToken);
    if (!existingToken) {
      return Err(VerifyToken.INVALID_TOKEN);
    }

    await this.userRepository.update(existingToken.userId, {
      status: UserStatus.VERIFIED,
      updatedAt: new Date(),
    });

    await this.userTokenRepository.delete(existingToken.id);
    return Ok(null);
  }
}
