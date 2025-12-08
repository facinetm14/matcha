import { inject, injectable } from 'inversify';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserRepository } from '../ports/repositories/user.repository';

@injectable()
export class FilterUsersUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    filter: FilterUsersDto,
    userId: string,
  ): Promise<UserProfile[]> {
    return this.userRepository.findUsersByFilter(filter, userId);
  }
}
