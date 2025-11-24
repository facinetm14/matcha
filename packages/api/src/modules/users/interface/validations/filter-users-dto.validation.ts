import * as z from 'zod';

export const FilterUsersDtoSchema = z.object({
  age: z
    .object({
      from: z.number(),
      to: z.number().optional(),
    })
    .optional(),

  fameRating: z
    .object({
      from: z.number(),
      to: z.number().optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});
