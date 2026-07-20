import { UserTokenCateory } from "../../application/consts/user-token-category";

export type UserToken = {
  id: string;
  token: string;
  userId: string;
  category: UserTokenCateory;
  ipAddr: string;
  device: string;
  expireAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
