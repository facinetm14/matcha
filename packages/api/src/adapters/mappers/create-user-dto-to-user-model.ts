import { CreateUserDto } from '../../core/domain/dto/create-user.dto';
import { UserStatus } from '../../core/domain/enums/user-status.enum';
import { UserModel } from '../../infrastructure/persistence/models/user.model';

export const mapCreateUserDtoToUserModel = (
  createUserDto: CreateUserDto,
): UserModel => {
  const now = new Date();
  return {
    id: createUserDto.id,
    email: createUserDto.email,
    first_name: createUserDto.firstName,
    last_name: createUserDto.lastName,
    passwd: createUserDto.passwd,
    username: createUserDto.username,
    status: UserStatus.UNVERIFIED,
    created_at: now,
    updated_at: now,
  };
};
