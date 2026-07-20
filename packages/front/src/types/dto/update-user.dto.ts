import { Gender, Location } from '../user';

export type UpdateUserDto =  {
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  tags?: string[];
  location?: Location;
  passwd?: string;
  confirmPasswd?: string;
}
