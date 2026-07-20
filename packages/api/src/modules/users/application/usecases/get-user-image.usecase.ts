import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import {
  ImageStorageService,
  StoredImage,
} from '../ports/services/image-storage.service';

@injectable()
export class GetUserImageUseCase {
  constructor(
    @inject(TYPE.ImageStorageService)
    private readonly imageStorage: ImageStorageService,
  ) {}

  async execute(key: string): Promise<StoredImage | null> {
    return this.imageStorage.getObject(key);
  }
}
