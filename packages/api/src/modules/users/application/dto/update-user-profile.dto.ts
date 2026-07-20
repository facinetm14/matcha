import {
  Gender,
  Location,
} from '@/modules/users/domain/entities/user-profile.entity';

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
  location?: Location;
}
