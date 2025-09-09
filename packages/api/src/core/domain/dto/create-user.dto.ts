import * as z from 'zod';

export const CreateUserDtoSchema = z.object({
  email: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  passwd: z.string(),
  confirmPasswd: z.string(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema> & {
  id: string;
};
