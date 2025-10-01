import { UserToken } from '../entities/user-token.entity';

export type UserRegisteredPayload = {
  username: string;
  email: string;
  userToken: UserToken;
};
