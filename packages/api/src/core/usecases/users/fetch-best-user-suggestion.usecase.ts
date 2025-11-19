import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { inject, injectable } from 'inversify';

@injectable()
export class FetchBestUserSuggestion {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(_userId: string): Promise<UserProfile | null> {
    const mock = '2jtgok-mh0qljsv-g884ib-bwc65m';

    return this.userRepository.findUserProfileById(mock);
  }
}
