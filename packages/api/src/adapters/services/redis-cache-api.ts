import { CacheService } from '../../core/ports/services/cache.service';
import { createClient, RedisClientType } from 'redis';
import { TYPE } from '../../infrastructure/config/inversify-type';
import { Logger } from '../../core/ports/services/logger.service';
import { inject, injectable } from 'inversify';

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
      await this.client.connect();
      await this.client.hSet(resourceKey, data.id, JSON.stringify(data));
      await this.client.quit();

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
    await this.client.connect();
    const token = await this.client.hGet(resourceKey, id);
    await this.client.quit();

    if (!token) return null;

    return JSON.parse(token) as T;
  }

  async delete(resourceKey: string, id: string): Promise<void> {
    await this.client.connect();
    await this.client.hDel(resourceKey, id);
    await this.client.quit();
  }
}
