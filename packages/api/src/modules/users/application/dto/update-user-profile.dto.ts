import { Gender } from '@/modules/users/domain/entities/user-profile.entity';
import { UploadImageDto } from './upload-image.dto';

export interface UpdateUserProfileDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  passwd?: string;
  confirmPasswd?: string;
  birthDate?: Date;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  tags?: string[];
  photos?: UploadImageDto[];
}
