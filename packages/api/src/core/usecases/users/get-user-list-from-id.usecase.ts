import { inject, injectable } from 'inversify';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';

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
