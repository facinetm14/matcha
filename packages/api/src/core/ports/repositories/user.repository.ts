import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { UpdateUserDto } from '../../domain/dto/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';

export interface UserRepository {
  create(createUserDto: CreateUserDto): Promise<string | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;

  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
}
