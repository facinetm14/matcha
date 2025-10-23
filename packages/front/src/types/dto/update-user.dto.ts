import { Gender } from '../user';

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  tags?: string[];
  photos?: string[];
  passwd?: string;
  confirmPasswd?: string;
}
