export type ImagePosition = {
  preview: string;
  position: number;
};

export type UpdateImagePositionDto = {
  images: ImagePosition[];
};
