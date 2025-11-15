import { UserImageRepository } from '@/core/ports/repositories/user-image.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { inject, injectable } from 'inversify';

@injectable()
export class ReorderUserImageUseCase {
  constructor(
    @inject(TYPE.UserImageRepository)
    private readonly userImageRepository: UserImageRepository,
  ) {}

  async execute(
    userId: string,
    imageList: { preview: string; position: number }[],
  ): Promise<void> {
    return this.userImageRepository.reorderImages(userId, imageList);
  }
}
