import * as z from 'zod';

export const LoginUserDtoSchema = z.object({
  username: z.string(),
  passwd: z.string(),
});
