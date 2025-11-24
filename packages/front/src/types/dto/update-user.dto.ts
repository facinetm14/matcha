import { Gender, Location } from '../user';
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
  location?: Location;
  passwd?: string;
  confirmPasswd?: string;
}
