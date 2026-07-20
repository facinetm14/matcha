import { injectable } from 'inversify';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/modules/users/application/consts/upload-dest';
import { ImageStorageService } from '@/modules/users/application/ports/services/image-storage.service';

@injectable()
export class LocalDiskImageStorage implements ImageStorageService {
  private resolvePath(filename: string): string {
    return join(process.cwd(), UPLOAD_DEST, filename);
  }

  exists(filename: string): boolean {
    return existsSync(this.resolvePath(filename));
  }

  getSize(filename: string): number {
    return statSync(this.resolvePath(filename)).size;
  }

  createReadStream(filename: string): NodeJS.ReadableStream {
    return createReadStream(this.resolvePath(filename));
  }

  async save(filename: string, data: Buffer): Promise<void> {
    const uploadDirectory = join(process.cwd(), UPLOAD_DEST);
    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    await writeFile(this.resolvePath(filename), data);
  }

  async delete(filename: string): Promise<void> {
    const path = this.resolvePath(filename);
    if (existsSync(path)) {
      await unlink(path);
    }
  }
}
