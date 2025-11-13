import { EventType } from '@/core/domain/enums/event-type';
import { UserImageRepository } from '@/core/ports/repositories/user-image.repository';
import { EventBus } from '@/core/ports/services/event-bus';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteUserImageUsceCase {
  constructor(
    @inject(TYPE.UserImageRepository)
    private readonly userImageRepository: UserImageRepository,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
  ) {}

  async execute(userId: string, previewList: string[]): Promise<void> {
    this.eventBus.emitEvent(
      EventType.USER_IMAGE_DELETED,
      JSON.stringify({ userId, images: previewList }),
    );
    return this.userImageRepository.delete(userId, previewList);
  }
}
