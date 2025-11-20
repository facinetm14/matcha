import { inject, injectable } from 'inversify';
import { UserRepository } from '../ports/repositories/user.repository';
import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class GetUserListFromIdListUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userIdList: string[]): Promise<UserProfile[]> {
    return this.userRepository.findUserProfileByIdList(userIdList);
  }
}
