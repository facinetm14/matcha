import { UpdateUserProfileDto } from '@/core/domain/dto/update-user-profile.dto';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { EventType } from '@/core/domain/enums/event-type';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { UpdateUserProfileError } from '@/core/domain/errors/update-user-profile.error';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { UserInterestRepository } from '@/core/ports/repositories/user-interest.repository';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { EventBus } from '@/core/ports/services/event-bus';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { injectable, inject } from 'inversify';

@injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserInterestRepository)
    private readonly userInterestRepository: UserInterestRepository,
    @inject(TYPE.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<Result<UserProfile, UpdateUserProfileError>> {
    const { tags, photos, ...user } = updateUserProfileDto;

    if (user) {
      const existingUsername = user.username
        ? await this.userRepository.findUserByUniqKey(
            UserUniqKeys.username,
            user.username,
          )
        : null;

      const isUsernameUsed = existingUsername && existingUsername.id !== userId;

      if (isUsernameUsed) {
        return Err(UpdateUserProfileError.USERNAME_ALREADY_EXISTS);
      }

      const existingEmail = user.email
        ? await this.userRepository.findUserByUniqKey(
            UserUniqKeys.EMAIL,
            user.email,
          )
        : null;

      const isEmailUsed = existingEmail && existingEmail.id !== userId;

      if (isEmailUsed) {
        return Err(UpdateUserProfileError.EMAIL_AREDAY_EXISTS);
      }

      const updatedUser = await this.userRepository.update(userId, {
        ...user,
        sexualOrientation: user.sexualOrientation
          ? user.sexualOrientation.join(' ')
          : '',
      });

      if (!updatedUser) {
        return Err(UpdateUserProfileError.UNKNOWN_ERROR);
      }
    }

    if (photos) {
      this.eventBus.emitEvent(
        EventType.UPLOAD_USER_IMAGE,
        JSON.stringify({ author: userId, photos }),
      );
    }

    if (tags) {
      await this.userInterestRepository.bulkCreate(userId, tags);
    }

    const updatedUserProfileResult =
      await this.userRepository.findUserProfileById(userId);

    if (!updatedUserProfileResult) {
      return Err(UpdateUserProfileError.USER_NOT_FOUND);
    }

    return Ok(updatedUserProfileResult);
  }
}
