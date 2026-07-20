import * as z from 'zod';
import { MAX_USER_PHOTOS } from '@/modules/users/application/consts/image-upload.const';

export const UploadUserImagesPositionsSchema = z
  .array(z.number())
  .max(MAX_USER_PHOTOS, {
    message: `You can upload up to ${MAX_USER_PHOTOS} photos only.`,
  });
