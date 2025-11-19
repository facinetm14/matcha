import { Err, Ok, Result } from '../../domain/utils/result';
import { VerifyTokenError } from '../../domain/errors/verify-token.error';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { EventBus } from '@/core/ports/services/event-bus';
import { uuid } from '@shared/uuid';
import { Notification } from '@/core/domain/entities/notification.entity';
import { EventType } from '@/core/domain/enums/event-type';

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

      this.eventBus.emitEvent(
        EventType.USER_INTERACTION_ADDED,
        JSON.stringify(notification),
      );
    }

    return Ok(userProfile);
  }
}
