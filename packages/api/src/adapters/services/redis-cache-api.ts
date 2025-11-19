import { createClient, RedisClientType } from 'redis';
import { TYPE } from '../../infrastructure/config/inversify-type';
import { Logger } from '../../core/ports/services/logger.service';
import { inject, injectable } from 'inversify';

import { CacheService } from '../../core/ports/services/cache.service';
@injectable()
export class RedisCacheApi implements CacheService {
  private client: RedisClientType;

  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {
    this.client = createClient({
      url: 'redis://redis:6379',
    });
    this.client.once('error', (error: unknown) =>
      this.logger.error(`Failed to create redis client ${error}`),
    );
  }

  async insert<T extends { id: string }>(
    resourceKey: string,
    data: T,
  ): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.hSet(resourceKey, data.id, JSON.stringify(data));

      return data.id;
    } catch (error) {
      this.logger.error(`Failed to insert access token in redis ${error}`);
      return null;
    }
  }

  async findById<T extends { id: string }>(
    resourceKey: string,
    id: string,
  ): Promise<T | null> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    const token = await this.client.hGet(resourceKey, id);

    if (!token) return null;

    return JSON.parse(token) as T;
  }

  async delete(resourceKey: string, id: string): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    await this.client.hDel(resourceKey, id);
  }
}
