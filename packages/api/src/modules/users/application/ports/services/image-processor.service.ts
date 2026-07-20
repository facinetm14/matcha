import { ImageFormat } from '@/modules/users/domain/services/detect-image-format';

export interface ImageProcessor {
  compress(data: Buffer, format: ImageFormat): Promise<Buffer>;
}
