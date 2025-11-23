import * as z from 'zod';

export const CreateResetPasswordLinkDtoSchema = z.object({
  email: z.string(),
});
