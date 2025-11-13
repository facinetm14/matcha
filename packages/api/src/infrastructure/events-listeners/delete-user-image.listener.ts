import { EventType } from '../../core/domain/enums/event-type';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/core/domain/consts/upload-dest';
import { existsSync } from 'node:fs';
import { unlink } from 'node:fs/promises';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);

type DeleteImagePayload = {
  userId: string;
  images: string[];
};

eventBus.listenTo(EventType.USER_IMAGE_DELETED, async (payload: string) => {
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
