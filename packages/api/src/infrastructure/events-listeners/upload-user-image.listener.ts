import { EventType } from '../../core/domain/enums/event-type';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';
import { UploadImageDto } from '@/core/domain/dto/upload-image.dto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/core/domain/consts/upload-dest';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);

type UploadImagePayload = {
  author: string;
  photos: UploadImageDto[];
};

const isValidBase64Image = (base64: string) => {
  const regex = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+=*$/;
  return regex.test(base64);
};

eventBus.listenTo(EventType.UPLOAD_USER_IMAGE, async (payload: string) => {
  const userImagePayload = JSON.parse(payload) as UploadImagePayload;
  for (const image of userImagePayload.photos) {
    if (!isValidBase64Image(image.dataInBase64)) {
      logger.error(
        `Invalid image format ${image.position}. Only JPEG and PNG are allowed`,
      );
      break;
    }

    const matches =
      image.dataInBase64.match(/^data:image\/(jpeg|png);base64,(.+)$/) ?? [];
    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const filename = `${userImagePayload.author}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const path = join(process.cwd(), UPLOAD_DEST, filename);
    try {
      await writeFile(path, buffer);
    } catch (error) {
      logger.error(`Failed to save image. Reason: ${error}`);
    }
  }

  if (!userImagePayload) {
    logger.error(
      `Failed to handle ${EventType.UPLOAD_USER_IMAGE} event caused by invalid payload`,
    );
    return;
  }
});
