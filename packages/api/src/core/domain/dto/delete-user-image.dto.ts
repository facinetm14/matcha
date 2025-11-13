import * as z from 'zod';

export const DeleteUserImageDtoSchema = z.object({
  images: z.array(z.string()),
});

export type DeleteUserImageDto = z.infer<typeof DeleteUserImageDtoSchema>;
