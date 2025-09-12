export interface CacheService {
  insert<T extends { id: string }>(
    resourceKey: string,
    data: T,
  ): Promise<string | null>;
  findById<T extends { id: string }>(
    resourceKey: string,
    id: string,
  ): Promise<T | null>;

  delete(
    resourceKey: string,
    id: string,
  ): Promise<void>;
}
