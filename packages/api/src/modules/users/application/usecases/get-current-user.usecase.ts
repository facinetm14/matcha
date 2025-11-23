import { Err, Ok, Result } from '../../../shared/utils/result';
import { VerifyTokenError } from '../../../auth/application/errors/verify-token.error';
import { inject, injectable } from 'inversify';
import { UserRepository } from '../ports/repositories/user.repository';
import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { EventBus } from '@/modules/shared/ports/event-bus';
import { uuid } from '@shared/uuid';
import { Notification } from '@/modules/notifications/domain/entities/notification.entity';
import { EventType } from '@/modules/shared/consts/event-type';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
  ) {}

  async execute(
    userId: string,
    targetUserId?: string,
    isViewing?: boolean,
  ): Promise<Result<UserProfile, VerifyTokenError>> {
    const userProfile = await this.userRepository.findUserProfileById(
      targetUserId ?? userId,
    );

    if (!userProfile) {
      return Err(VerifyTokenError.USER_NOT_FOUND);
    }

    if (userProfile.isFirstLogin) {
      await this.userRepository.update(userId, { isFirstLogin: null });
    }

    if (targetUserId && userId !== targetUserId && isViewing) {
      const now = new Date();
      const notification: Notification = {
        id: uuid(),
        fromUser: userId,
        author: targetUserId,
        category: 'view',
        isRead: false,
        createdAt: now,
        updatedAt: now,
      };

      this.eventBus.publish(
        EventType.USER_INTERACTION_ADDED,
        JSON.stringify(notification),
      );
    }

    return Ok(userProfile);
  }
}
