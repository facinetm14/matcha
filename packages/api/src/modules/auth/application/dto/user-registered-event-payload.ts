import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

export type UserRegisteredEventPayload = {
  username: string;
  email: string;
  userToken: UserToken;
};
