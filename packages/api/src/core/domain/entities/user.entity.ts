import { UserStatus } from "../enums/user-status.enum";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  passwd: string;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
};
