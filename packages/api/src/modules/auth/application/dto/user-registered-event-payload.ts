import { UserToken } from "../../domain/entities/user-token.entity";

export type UserRegisteredEventPayload = {
  username: string;
  email: string;
  userToken: UserToken;
};
