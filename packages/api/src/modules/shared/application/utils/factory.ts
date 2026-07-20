import { User } from '@/modules/users/domain/entities/user.entity';
import { UserStatus } from '@/modules/users/domain/consts/user-status.enum';
import { uuid } from '@shared/uuid';
import { UserTokenCateory } from '@/modules/auth/domain/consts/user-token-category';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

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
