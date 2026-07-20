import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { EventType } from '@/modules/shared/application/consts/event-type';
import { UserUniqKeys } from '@/modules/users/application/consts/user-uniq-keys.enum';
import { UpdateUserProfileError } from '@/modules/users/application/errors/update-user-profile.error';
import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { UserInterestRepository } from '@/modules/users/application/ports/repositories/user-interest.repository';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { injectable, inject } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { CreateUserLocationDto } from '../dto/create-user-location-dto';
import { uuid } from '@shared/uuid';
import { UserLocationRepository } from '../ports/repositories/user-location.repository';

@injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserInterestRepository)
    private readonly userInterestRepository: UserInterestRepository,
    @inject(TYPE.EventBus)
    private readonly eventBus: EventBus,
    @inject(TYPE.UserLocationRepository)
    private readonly userLocationRepository: UserLocationRepository,
  ) {}

  async execute(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<Result<UserProfile, UpdateUserProfileError>> {
    const { tags, photos, location, ...user } = updateUserProfileDto;

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

      const { sexualOrientation, ...updateUserDto } = user;

      if (Object.entries(updateUserDto).length || sexualOrientation?.length) {
        const updatedUser = await this.userRepository.update(userId, {
          ...updateUserDto,
          ...(sexualOrientation?.length && {
            sexualOrientation: sexualOrientation.join(' '),
          }),
        });

        if (!updatedUser) {
          return Err(UpdateUserProfileError.UNKNOWN_ERROR);
        }
      }
    }

    if (photos) {
      this.eventBus.publish(
        EventType.UPLOAD_USER_IMAGE,
        JSON.stringify({ author: userId, photos }),
      );
    }

    if (tags) {
      await this.userInterestRepository.deleteByUserId(userId);
      if (tags.length) {
        await this.userInterestRepository.bulkCreate(userId, tags);
      }
    }

    if (location) {
     

      const existingLocation =
        await this.userLocationRepository.findByUserId(userId);

      if (existingLocation) {
        await this.userLocationRepository.update(userId, location);
      } else {
        const createUserLocation: CreateUserLocationDto = {
          ...location,
          id: uuid(),
          userId,
        };

        await this.userLocationRepository.create(createUserLocation);
      }
    }

    const updatedUserProfileResult =
      await this.userRepository.findUserProfileById(userId);

    if (!updatedUserProfileResult) {
      return Err(UpdateUserProfileError.USER_NOT_FOUND);
    }

    return Ok(updatedUserProfileResult);
  }
}
