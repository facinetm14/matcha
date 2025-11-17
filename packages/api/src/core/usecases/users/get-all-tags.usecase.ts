import { UserInterestRepository } from '@/core/ports/repositories/user-interest.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
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
