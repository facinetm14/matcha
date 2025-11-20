import { TYPE } from '@/config/ioc/inversify-type';
import { UserImageRepository } from '@/modules/users/application/ports/repositories/user-image.repository';
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
