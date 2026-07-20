import { CreateUserDto } from '@/modules/auth/application/dto/create-user.dto';
import { UserRepositoryInMemory } from '@/modules/users/infrastructure/adapters/repositories/user-repository-InMemory';
import { UserTokenRepositoryInMemory } from '@/modules/auth/infrastructure/adapters/repositories/user-token-repository-inMemory';
import { uuid } from '@shared/uuid';

export const MOCK_CURRENT_USER_ID = 'user-id-1234';

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
