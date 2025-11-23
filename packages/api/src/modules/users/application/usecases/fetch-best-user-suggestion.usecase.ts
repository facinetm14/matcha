import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class FetchBestUserSuggestion {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserProfile | null> {
    const mock = '2jtgok-mh0qljsv-g884ib-bwc65m';
    const mock2 = '9w29xp-mgz05g31-wwmy1x-he3qk8';

    const targetUserId = userId === mock ? mock2 : mock;

    return this.userRepository.findUserProfileById(targetUserId);
  }
}
