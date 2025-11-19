import {
  CreateInteractionDto,
} from '@/core/domain/dto/create-interaction.dto';
import { Notification } from '@/core/domain/entities/notification.entity';
import { InteractionCategory } from '@/core/domain/entities/user-profile-interaction.entity';
import { EventType } from '@/core/domain/enums/event-type';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { EventBus } from '@/core/ports/services/event-bus';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { uuid } from '@shared/uuid';
import { inject, injectable } from 'inversify';

/**
 * TODO send notification to recipient user
 */

export type AddUserInteractionError =
  | 'author_not_found'
  | 'recipient_not_found'
  | 'unknow_error'
  | 'unauthorized';

@injectable()
export class AddUserInteractionUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserInteractionRepository)
    private readonly userInteractionRepository: UserInteractionRepository,
    @inject(TYPE.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    createInteractionDto: CreateInteractionDto,
    userId: string,
  ): Promise<Result<null, AddUserInteractionError>> {
    const author = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      userId,
    );
    if (!author) {
      return Err('author_not_found');
    }

    const recipientUser = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      createInteractionDto.recipient,
    );

    if (!recipientUser) {
      return Err('recipient_not_found');
    }

    if (author.id === recipientUser.id) {
      return Err('unauthorized');
    }

    const now = new Date();
    const notification: Notification = {
      id: uuid(),
      author: createInteractionDto.recipient,
      fromUser: userId,
      isRead: false,
      createdAt: now,
      updatedAt: now,
      category: createInteractionDto.category,
    };

    if (this.isRevokingCategory(createInteractionDto.category)) {
      await this.userInteractionRepository.delete(
        {
          ...createInteractionDto,
          category: this.getCategoryToRevoke(createInteractionDto.category),
        },
        userId,
      );

      this.eventBus.emitEvent(
        EventType.USER_INTERACTION_ADDED,
        JSON.stringify(notification),
      );

      return Ok(null);
    }

    const newInteraction = await this.userInteractionRepository.create(
      createInteractionDto,
      userId,
    );

    if (!newInteraction) {
      return Err('unknow_error');
    }

    this.eventBus.emitEvent(
      EventType.USER_INTERACTION_ADDED,
      JSON.stringify(notification),
    );

    return Ok(null);
  }

  private isRevokingCategory(category: InteractionCategory): boolean {
    return category.startsWith('un');
  }

  private getCategoryToRevoke(
    category: InteractionCategory,
  ): InteractionCategory {
    return category.slice(2) as InteractionCategory;
  }
}
