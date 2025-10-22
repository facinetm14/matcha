import * as z from 'zod';

export const CreateInteractionDtoSchema = z.object({
  recipient: z.string(),
  category: z.enum([
    'like',
    'unlike',
    'swipe',
    'block',
    'unblock',
    'view',
    'report',
  ] as const),
});

export type CreateInteractionDto = z.infer<typeof CreateInteractionDtoSchema>;
