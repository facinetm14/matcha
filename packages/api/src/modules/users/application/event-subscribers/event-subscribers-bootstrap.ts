import { EventType } from '@/modules/shared/application/consts/event-type';
import { SocketEvents } from '@shared/socket-events';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { UploadImageDto } from '@/modules/users/application/dto/upload-image.dto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/modules/users/application/consts/upload-dest';
import { UserImageRepository } from '@/modules/users/application/ports/repositories/user-image.repository';
import { Server as SocketIoServer } from 'socket.io';
import { existsSync, mkdirSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

type UploadImagePayload = {
  author: string;
  photos: UploadImageDto[];
};

type DeleteImagePayload = {
  userId: string;
  images: string[];
};

const isValidBase64Image = (base64: string) => {
  const regex = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+=*$/;
  return regex.test(base64);
};

export function registerUsersEventSubscribers(): void {
  const eventBus = container.get<EventBus>(TYPE.EventBus);
  const logger = container.get<Logger>(TYPE.Logger);
  const userImageRepository = container.get<UserImageRepository>(
    TYPE.UserImageRepository,
  );
  const socketIoServer = container.get<SocketIoServer>(TYPE.SocketIoServer);

  // UPLOAD_USER_IMAGE event listener
  eventBus.subscribe(EventType.UPLOAD_USER_IMAGE, async (payload: string) => {
    const userImagePayload = JSON.parse(payload) as UploadImagePayload;
    if (!userImagePayload) {
      logger.error(
        `Failed to handle ${EventType.UPLOAD_USER_IMAGE} event caused by invalid payload`,
      );
      return;
    }

    const userImageList = [];

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

      const filename = `${userImagePayload.author}-image-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
      const uploadDirectory = join(process.cwd(), UPLOAD_DEST);
      if (!existsSync(uploadDirectory)) {
        mkdirSync(uploadDirectory, { recursive: true });
      }
      const path = join(uploadDirectory, filename);
      try {
        await writeFile(path, buffer);
        userImageList.push({ position: image.position, preview: filename });
      } catch (error) {
        logger.error(`Failed to save image. Reason: ${error}`);
      }
    }

    if (userImageList.length) {
      await userImageRepository.bulkCreate(
        userImagePayload.author,
        userImageList,
      );

      socketIoServer
        .to(userImagePayload.author)
        .emit(SocketEvents.USER_IMAGE_UPLOADED);
    }
  });

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
      const path = join(process.cwd(), UPLOAD_DEST, filename);
      if (existsSync(path)) {
        await unlink(path);
      }
    }

    logger.info(
      `user ${deleteImagePayload.images} images has been successfuly deleted`,
    );
  });
}
