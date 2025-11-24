import { CreateUserDto } from '../../../../auth/application/dto/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import { UserUniqKeys } from '../../consts/user-uniq-keys.enum';
import { FilterUsersDto } from '../../dto/filter-users.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

export interface UserRepository {
  create(createUserDto: CreateUserDto): Promise<string | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
  findUserProfileById(userId: string): Promise<UserProfile | null>;
  findUserProfileByIdList(userId: string[]): Promise<UserProfile[]>;
  findUsersByFilter(filter: FilterUsersDto, userId: string): Promise<UserProfile[]>;
}
