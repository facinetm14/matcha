import * as z from 'zod';

export const CreateMessageDtoSchema = z.object({
  channelId: z.string(),
  senderId: z.string(),
  content: z.string().trim().min(1).max(100),
});

export type CreateMessageDto = z.infer<typeof CreateMessageDtoSchema>;
