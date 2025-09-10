import { UserTokenCateory } from '../enums/user-token-category';

export interface UserToken {
  id: string;
  token: string;
  userId: string;
  category: UserTokenCateory;
  ipAddr: string;
  device: string;
  expireAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
