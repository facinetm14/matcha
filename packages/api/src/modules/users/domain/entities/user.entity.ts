import { UserStatus } from '../consts/user-status.enum';
import { Location } from './user-profile.entity';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  passwd: string;
  status: UserStatus;
  isFirstLogin: string | null;
  gender?: string;
  sexualOrientation?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate?: Date;
  location?: Location;
};
