import * as z from 'zod';
export const UserRegisteredPayloadSchema = z.object({
  id: z.string(),
  validationToken: z.string(),
  username: z.string(),
  email: z.string(),
});

export type UserRegisteredPayload = z.infer<typeof UserRegisteredPayloadSchema>;