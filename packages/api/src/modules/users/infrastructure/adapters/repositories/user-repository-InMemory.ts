import { CreateUserDto } from '../../../../auth/application/dto/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserUniqKeys } from '../../../application/consts/user-uniq-keys.enum';
import { UserRepository } from '../../../application/ports/repositories/user.repository';
import { factoryUser } from '@/modules/shared/utils/factory';
import { hashPassword } from '../../../../auth/infrastructure/utils/password';
import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { FilterUsersDto } from '@/modules/users/application/dto/filter-users.dto';

export class UserRepositoryInMemory implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }
  findUserProfileByIdList(_userId: string[]): Promise<UserProfile[]> {
    return Promise.resolve([]);
  }

  async create(createUserDto: CreateUserDto): Promise<string | null> {
    this.users.push(factoryUser({ ...createUserDto }));
    return Promise.resolve(createUserDto.id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const userToUpdate = this.users.find((u) => u.id === id);
    if (!userToUpdate) {
      return null;
    }

    const updatedUser = structuredClone({ ...userToUpdate, ...updateUserDto });

    const currentUsers = structuredClone(this.users);

    this.users = currentUsers.map((user) => {
      if (user.id === id) {
        return updatedUser;
      }
      return user;
    });

    const passwd = await hashPassword(updatedUser.passwd);

    return Promise.resolve({ ...updatedUser, passwd });
  }

  async findUserByUniqKey(
    key: UserUniqKeys,
    value: string,
  ): Promise<User | null> {
    const user = this.users.find((user) => {
      for (const [k, v] of Object.entries(user)) {
        if (key === k && v === value) {
          return true;
        }
      }
      return false;
    });
    if (user) {
      const passwd = await hashPassword(user?.passwd ?? '');
      return { ...user, passwd };
    }

    return null;
  }

  async findUserProfileById(userId: string): Promise<UserProfile | null> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }

    return Promise.resolve({
      ...user,
      tags: [],
      photos: [],
      fameRating: 0,
      isOnline: false,
      reported: false,
      lastSeen: null,
      likedBy: [],
      blocked: [],
      viewedBy: [],
      notifications: [],
      matched: [],
    });
  }

  async findUsersByFilter(
    _filter: FilterUsersDto,
    _userId: string,
  ): Promise<UserProfile[]> {
    return [];
  }
}
