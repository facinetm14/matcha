import { UserToken } from '../../core/domain/entities/user-token.entity';
import { UserTokenModel } from '../../infrastructure/persistence/models/user-token.model';

export function mapUserTokenEntityToModel(
  createUserToken: UserToken,
): UserTokenModel {
  return {
    id: createUserToken.id,
    user_id: createUserToken.userId,
    token: createUserToken.token,
    created_at: createUserToken.createdAt,
    updated_at: createUserToken.updatedAt,
    ip_addr: createUserToken.ipAddr,
    device: createUserToken.device,
    expire_at: createUserToken.expireAt,
    category: createUserToken.category,
  };
}
