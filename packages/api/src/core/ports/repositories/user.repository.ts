import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';

export interface UserRepository {
  create(createUserDto: CreateUserDto): Promise<string | null>;

  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
}
