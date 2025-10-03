import { UpdateUserProfileDto } from '@/core/domain/dto/update-user-profile.dto';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { UpdateUserProfileError } from '@/core/domain/errors/update-user-profile.error';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { injectable, inject } from 'inversify';

@injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<Result<UserProfile, UpdateUserProfileError>> {
    let updatedUser = null;
    const { user, interests } = updateUserProfileDto;

    if (user) {
      updatedUser = await this.userRepository.update(userId, user);
    }

    if (!updatedUser) {
      updatedUser = await this.userRepository.findUserByUniqKey(
        UserUniqKeys.ID,
        userId,
      );
    }

    if (!updatedUser) {
      return Err(UpdateUserProfileError.USER_NOT_FOUND);
    }

    if (interests) {
      // TODO tobe implemented
    }

    return Ok({ user: updatedUser, interests: [] });
  }
}
