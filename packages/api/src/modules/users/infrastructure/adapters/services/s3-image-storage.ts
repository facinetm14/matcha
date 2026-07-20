import { injectable } from 'inversify';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  ImageStorageService,
  StoredImage,
} from '@/modules/users/application/ports/services/image-storage.service';
import { loadImageStorageConfig } from '@/modules/users/infrastructure/config/image-storage.config';

@injectable()
export class S3ImageStorage implements ImageStorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    const config = loadImageStorageConfig();

    this.bucket = config.bucket;
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: config.forcePathStyle,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async getObject(key: string): Promise<StoredImage | null> {
    try {
      const object = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );

      if (!object.Body) {
        return null;
      }

      return {
        stream: object.Body as NodeJS.ReadableStream,
        size: object.ContentLength ?? 0,
        contentType: object.ContentType ?? 'application/octet-stream',
      };
    } catch (error) {
      if (error instanceof NoSuchKey) {
        return null;
      }
      throw error;
    }
  }

  async save(key: string, data: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
