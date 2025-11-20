import { TYPE } from '@/config/ioc/inversify-type';
import { UserUniqKeys } from '@/modules/users/application/consts/user-uniq-keys.enum';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CheckUserIdentifierAvailabilityUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(field: UserUniqKeys, value: string): Promise<boolean> {
    const existingUser = await this.userRepository.findUserByUniqKey(
      field,
      value,
    );
    return !existingUser;
  }
}
