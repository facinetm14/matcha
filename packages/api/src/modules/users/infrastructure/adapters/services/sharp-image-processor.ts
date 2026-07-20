import { injectable } from 'inversify';
import sharp from 'sharp';
import { ImageProcessor } from '@/modules/users/application/ports/services/image-processor.service';
import { ImageFormat } from '@/modules/users/domain/services/detect-image-format';
import {
  PHOTO_COMPRESSION_QUALITY,
  PHOTO_MAX_WIDTH_PX,
} from '@/modules/users/application/consts/image-upload.const';

@injectable()
export class SharpImageProcessor implements ImageProcessor {
  async compress(data: Buffer, format: ImageFormat): Promise<Buffer> {
    const resized = sharp(data).resize({
      width: PHOTO_MAX_WIDTH_PX,
      withoutEnlargement: true,
    });

    if (format === 'png') {
      return resized
        .png({ quality: PHOTO_COMPRESSION_QUALITY })
        .toBuffer();
    }

    return resized.jpeg({ quality: PHOTO_COMPRESSION_QUALITY }).toBuffer();
  }
}
