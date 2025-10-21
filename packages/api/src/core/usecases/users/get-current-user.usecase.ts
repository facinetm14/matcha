import { Err, Ok, Result } from '../../domain/utils/result';
import { VerifyTokenError } from '../../domain/errors/verify-token.error';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<Result<UserProfile, VerifyTokenError>> {
    const userProfile = await this.userRepository.findUserProfileById(userId);

    await this.userRepository.findUserProfileById(userId);

    if (!userProfile) {
      return Err(VerifyTokenError.USER_NOT_FOUND);
    }

    if (userProfile.user.isFirstLogin) {
      await this.userRepository.update(userId, { isFirstLogin: null });
    }

    return Ok(userProfile);
  }
}
