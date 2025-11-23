import { Gender } from '../user';
import { UserImageDto } from './user-image.dto';

export type UpdateUserDto =  {
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  tags?: string[];
  photos?: UserImageDto[];
  passwd?: string;
  confirmPasswd?: string;
}
