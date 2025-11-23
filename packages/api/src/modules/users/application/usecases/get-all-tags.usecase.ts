import { TYPE } from '@/config/ioc/inversify-type';
import { UserInterestRepository } from '@/modules/users/application/ports/repositories/user-interest.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class GetAllTagsUseCase {
  constructor(
    @inject(TYPE.UserInterestRepository)
    private readonly userInterestRepository: UserInterestRepository,
  ) {}

  async execute(): Promise<string[]> {
    return this.userInterestRepository.findAll();
  }
}
