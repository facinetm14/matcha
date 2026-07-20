export interface ImageStorageService {
  exists(filename: string): boolean;
  getSize(filename: string): number;
  createReadStream(filename: string): NodeJS.ReadableStream;
  save(filename: string, data: Buffer): Promise<void>;
  delete(filename: string): Promise<void>;
}
