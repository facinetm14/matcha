import { User } from '../api/src/core/domain/entities/user.entity';
import { UserStatus } from '../api/src/core/domain/enums/user-status.enum';
import { uuid } from './uuid';
import { UserToken } from '../api/src/core/domain/entities/user-token.entity';
import { UserTokenCateory } from '../api/src/core/domain/enums/user-token-category';
import { UserRepositoryInMemory } from '../api/src/adapters/repositories/user-repository-InMemory';
import { CreateUserDto } from '../api/src/core/domain/dto/create-user.dto';
import { UserTokenRepositoryInMemory } from '../api/src/adapters/repositories/user-token-repository-inMemory';

export function factoryUser(user: Partial<User>): User {
  const now = new Date();
  return {
    id: uuid(),
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    passwd: '',
    createdAt: now,
    updatedAt: now,
    status: UserStatus.UNVERIFIED,
    ...user,
  };
}

export function factoryUserToken(userToken: Partial<UserToken>): UserToken {
  const now = new Date();
  return {
    id: uuid(),
    token: uuid(),
    category: UserTokenCateory.ONE_TIME,
    ipAddr: '',
    device: '',
    expireAt: null,
    createdAt: now,
    updatedAt: now,
    userId: '',
    ...userToken,
  };
}

export function factoryUserRepositoryInMemory(): UserRepositoryInMemory {
  return new UserRepositoryInMemory();
}

export function factoryUserTokenRepositoryInMemory(): UserTokenRepositoryInMemory {
  return new UserTokenRepositoryInMemory();
}

export function factoryCreateUserDto(
  createUserDto: Partial<CreateUserDto>,
): CreateUserDto {
  const now = new Date();

  return {
    id: uuid(),
    email: '',
    username: '',
    passwd: '',
    confirmPasswd: '',
    firstName: '',
    lastName: '',
    createdAt: now,
    updatedAt: now,
    ...createUserDto,
  };
}
