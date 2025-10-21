import * as z from 'zod';
import { UserStatus } from '../enums/user-status.enum';

export const CreateUserDtoSchema = z.object({
  email: z.email(),
  username: z.string().trim().min(3),
  firstName: z.string().trim().min(3),
  lastName: z.string().trim().min(3),
  passwd: z.string(),
  confirmPasswd: z.string(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema> & {
  id: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
};
