import { User } from '@/modules/users/domain/entities/user.entity';

export type UpdateUserDto = Partial<User> & {
  confirmPasswd?: string;
};
