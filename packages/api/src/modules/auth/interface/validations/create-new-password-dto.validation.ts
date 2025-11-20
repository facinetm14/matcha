import * as z from 'zod';

export const CreateNewPasswordDtoSchema = z.object({
  passwd: z.string(),
  confirmPasswd: z.string(),
});
