import { UserStatus } from '@/modules/users/application/consts/user-status.enum';

export type CreateUserDto = {
  id: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  sexualOrientation?: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  passwd: string;
  confirmPasswd: string;
}
