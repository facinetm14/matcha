export interface StoredImage {
  stream: NodeJS.ReadableStream;
  size: number;
  contentType: string;
}

export interface ImageStorageService {
  getObject(key: string): Promise<StoredImage | null>;
  save(key: string, data: Buffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
}
