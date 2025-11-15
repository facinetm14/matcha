import * as z from 'zod';

export const ReorderImagesDtoSchema = z.object({
  images: z.array(
    z.object({
      preview: z.string(),
      position: z.number(),
    }),
  ),
});

export type ReorderImagesDto = z.infer<typeof ReorderImagesDtoSchema>;
