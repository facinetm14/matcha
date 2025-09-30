import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
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
