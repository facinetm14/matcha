import { UserStatus } from "../../../core/domain/enums/user-status.enum";

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
}