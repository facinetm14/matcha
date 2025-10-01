import * as z from 'zod';

export const ResetPasswordDtoSchema = z.object({
  email: z.string()
})

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>