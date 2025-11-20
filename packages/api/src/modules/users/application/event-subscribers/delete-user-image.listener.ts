import { EventType } from '../../../shared/consts/event-type';
import { EventBus } from '../../../shared/ports/event-bus';
import { Logger } from '../../../shared/ports/logger.service';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/modules/users/application/consts/upload-dest';
import { existsSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);

type DeleteImagePayload = {
  userId: string;
  images: string[];
};

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
    const path = join(process.cwd(), UPLOAD_DEST, filename);
    if (existsSync(path)) {
      await unlink(path);
    }
  }

  logger.info(
    `user ${deleteImagePayload.images} images has been successfuly deleted`,
  );
});
