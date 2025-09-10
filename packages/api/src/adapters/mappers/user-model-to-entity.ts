import { User } from '../../core/domain/entities/user.entity';
import { UserModel } from '../../infrastructure/persistence/models/user.model';

export function mapUserModelToEntity(userModel: UserModel): User {
  return {
    id: userModel.id,
    username: userModel.username,
    updatedAt: userModel.updated_at,
    createdAt: userModel.created_at,
    firstName: userModel.first_name,
    lastName: userModel.last_name,
    email: userModel.email,
    passwd: userModel.passwd,
    status: userModel.status,
  };
}
