import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { ImageStorageService } from '../ports/services/image-storage.service';

export type UserImageStream = {
  stream: NodeJS.ReadableStream;
  size: number;
};

@injectable()
export class GetUserImageUseCase {
  constructor(
    @inject(TYPE.ImageStorageService)
    private readonly imageStorage: ImageStorageService,
  ) {}

  execute(filename: string): UserImageStream | null {
    if (!this.imageStorage.exists(filename)) {
      return null;
    }

    return {
      stream: this.imageStorage.createReadStream(filename),
      size: this.imageStorage.getSize(filename),
    };
  }
}
