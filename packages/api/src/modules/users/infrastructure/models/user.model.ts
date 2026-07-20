import { UserStatus } from '../../application/consts/user-status.enum';

export type UserModel = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  passwd: string;
  created_at: Date;
  updated_at: Date;
  status: UserStatus;
  is_first_login: string | null;
  gender?: string;
  sexual_orientation?: string;
  bio?: string;
  birth_date?: Date;
};
