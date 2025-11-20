import { UserToken } from '../../domain/entities/user-token.entity';
import { UserTokenModel } from '../models/user-token.model';

export function mapUserTokenModelToEntity(
  userTokenModel: UserTokenModel,
): UserToken {
  return {
    id: userTokenModel.id,
    userId: userTokenModel.user_id,
    token: userTokenModel.token,
    updatedAt: userTokenModel.updated_at,
    category: userTokenModel.category,
    ipAddr: userTokenModel.ip_addr,
    createdAt: userTokenModel.created_at,
    device: userTokenModel.device,
    expireAt: userTokenModel.expire_at,
  };
}
