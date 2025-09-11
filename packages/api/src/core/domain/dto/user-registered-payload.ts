import { UserToken } from '../entities/user-token.entity';

export type UserRegisteredPayload = {
  id: string;
  username: string;
  email: string;
  userToken: UserToken;
};
