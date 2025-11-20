import { EventType } from '@/modules/shared/consts/event-type';
import { UserImageRepository } from '@/modules/users/application/ports/repositories/user-image.repository';
import { EventBus } from '@/modules/shared/ports/event-bus';
import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class DeleteUserImageUsceCase {
  constructor(
    @inject(TYPE.UserImageRepository)
    private readonly userImageRepository: UserImageRepository,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
  ) {}

  async execute(userId: string, previewList: string[]): Promise<void> {
    this.eventBus.publish(
      EventType.USER_IMAGE_DELETED,
      JSON.stringify({ userId, images: previewList }),
    );
    return this.userImageRepository.delete(userId, previewList);
  }
}
