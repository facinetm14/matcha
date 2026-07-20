import { EventType } from '@/modules/shared/application/consts/event-type';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { ImageStorageService } from '@/modules/users/application/ports/services/image-storage.service';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

type DeleteImagePayload = {
  userId: string;
  images: string[];
};

export function registerUsersEventSubscribers(): void {
  const eventBus = container.get<EventBus>(TYPE.EventBus);
  const logger = container.get<Logger>(TYPE.Logger);
  const imageStorage = container.get<ImageStorageService>(
    TYPE.ImageStorageService,
  );

  // USER_IMAGE_DELETED event listener
  eventBus.subscribe(EventType.USER_IMAGE_DELETED, async (payload: string) => {
    const deleteImagePayload = JSON.parse(payload) as DeleteImagePayload;

    if (!deleteImagePayload) {
      logger.error(
        `Failed to handle ${EventType.USER_IMAGE_DELETED} event caused by invalid payload`,
      );
      return;
    }

    const fileList = deleteImagePayload.images;
    for (const filename of fileList) {
      await imageStorage.delete(filename);
    }

    logger.info(
      `user ${deleteImagePayload.images} images has been successfuly deleted`,
    );
  });
}
