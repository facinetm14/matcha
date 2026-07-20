import multer from 'multer';
import {
  MAX_PHOTO_UPLOAD_SIZE_BYTES,
  MAX_USER_PHOTOS,
} from '@/modules/users/application/consts/image-upload.const';

const ACCEPTED_MIMETYPES = new Set(['image/jpeg', 'image/png']);

export const uploadUserImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PHOTO_UPLOAD_SIZE_BYTES,
    files: MAX_USER_PHOTOS,
  },
  fileFilter: (_req, file, callback) => {
    callback(null, ACCEPTED_MIMETYPES.has(file.mimetype));
  },
}).array('photos', MAX_USER_PHOTOS);
