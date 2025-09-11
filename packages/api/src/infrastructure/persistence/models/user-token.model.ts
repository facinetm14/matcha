import { UserTokenCateory } from "../../../core/domain/enums/user-token-category";

export interface UserTokenModel {
  id: string;
  token: string;
  user_id: string;
  category: UserTokenCateory
  ip_addr: string;
  device: string;
  expire_at: Date | null;
  created_at: Date;
  updated_at: Date;
}