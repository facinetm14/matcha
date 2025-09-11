import { CreateUserDto } from '../../core/domain/dto/create-user.dto';
import { UpdateUserDto } from '../../core/domain/dto/update-user.dto';
import { User } from '../../core/domain/entities/user.entity';
import { UserUniqKeys } from '../../core/domain/enums/user-uniq-keys.enum';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { factoryUser } from '../../../../shared/factory';
import { hashPassword } from '../../../../shared/password';

export class UserRepositoryInMemory implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async create(createUserDto: CreateUserDto): Promise<string | null> {
    this.users.push(factoryUser({ ...createUserDto }));
    return createUserDto.id;
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

    return { ...updatedUser, passwd };
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
}
