import { Gender } from '../user';

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  tags?: string[];
  location?: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  photos?: string[];
  profilePhoto?: string;
}
