export interface UserImageRepository {
  bulkCreate(
    userId: string,
    imageList: { position: number; preview: string }[],
  ): Promise<void>;

  delete(userId: string, previewList: string[]): Promise<void>;
  reorderImages(userId: string, imageList: {preview: string, position: number}[]): Promise<void>;
}
