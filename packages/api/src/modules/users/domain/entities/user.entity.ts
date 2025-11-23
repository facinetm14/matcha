import { UserStatus } from '../../application/consts/user-status.enum';

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
};
