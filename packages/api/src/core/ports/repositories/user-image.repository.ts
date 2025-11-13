export interface UserImageRepository {
  bulkCreate(
    userId: string,
    imageList: { position: number; preview: string }[],
  ): Promise<void>;

  delete(userId: string, previewList: string[]): Promise<void>;
  // switchPosition(userId: string, position1: number, position2: number): Promise<void>;
}
