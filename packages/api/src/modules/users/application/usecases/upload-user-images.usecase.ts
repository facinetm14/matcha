import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { ImageStorageService } from '@/modules/users/application/ports/services/image-storage.service';
import { ImageProcessor } from '@/modules/users/application/ports/services/image-processor.service';
import { UserImageRepository } from '@/modules/users/application/ports/repositories/user-image.repository';
import { detectImageFormat } from '@/modules/users/domain/services/detect-image-format';
import { UploadUserImagesError } from '@/modules/users/application/errors/upload-user-images.error';

export interface UserImageUpload {
  buffer: Buffer;
  position: number;
}

export interface UploadedUserImage {
  position: number;
  preview: string;
}

@injectable()
export class UploadUserImagesUseCase {
  constructor(
    @inject(TYPE.ImageStorageService)
    private readonly imageStorage: ImageStorageService,
    @inject(TYPE.ImageProcessor)
    private readonly imageProcessor: ImageProcessor,
    @inject(TYPE.UserImageRepository)
    private readonly userImageRepository: UserImageRepository,
    @inject(TYPE.Logger)
    private readonly logger: Logger,
  ) {}

  async execute(
    userId: string,
    uploads: UserImageUpload[],
  ): Promise<Result<UploadedUserImage[], UploadUserImagesError>> {
    const uploadedImages: UploadedUserImage[] = [];

    for (const upload of uploads) {
      const format = detectImageFormat(upload.buffer);

      if (!format) {
        this.logger.error(
          `Rejected image upload for user ${userId} at position ${upload.position}: unrecognized image signature`,
        );
        continue;
      }

      try {
        const compressed = await this.imageProcessor.compress(
          upload.buffer,
          format,
        );
        const extension = format === 'jpeg' ? 'jpg' : 'png';
        const filename = `${userId}-image-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
        const key = `users/${userId}/${filename}`;

        await this.imageStorage.save(key, compressed, `image/${format}`);
        uploadedImages.push({ position: upload.position, preview: key });
      } catch (error) {
        this.logger.error(`Failed to store image for user ${userId}. Reason: ${error}`);
      }
    }

    if (!uploadedImages.length) {
      return Err(UploadUserImagesError.NO_VALID_IMAGES);
    }

    await this.userImageRepository.bulkCreate(userId, uploadedImages);

    return Ok(uploadedImages);
  }
}
