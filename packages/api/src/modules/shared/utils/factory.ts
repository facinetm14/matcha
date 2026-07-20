import { User } from '../../users/domain/entities/user.entity';
import { UserStatus } from '../../users/domain/consts/user-status.enum';
import { uuid } from '@shared/uuid';
import { UserTokenCateory } from '../../auth/domain/consts/user-token-category';
import { UserRepositoryInMemory } from '../../users/infrastructure/adapters/repositories/user-repository-InMemory';
import { CreateUserDto } from '../../auth/application/dto/create-user.dto';
import { UserTokenRepositoryInMemory } from '../../auth/infrastructure/adapters/repositories/user-token-repository-inMemory';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

export const MOCK_CURRENT_USER_ID = 'user-id-1234';

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
    isFirstLogin: 'yes',
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
  { shouldMockId }: { shouldMockId: boolean } = { shouldMockId: false },
): CreateUserDto {
  const now = new Date();

  return {
    id: shouldMockId ? MOCK_CURRENT_USER_ID : uuid(),
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
