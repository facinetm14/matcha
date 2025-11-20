import * as z from 'zod';
import { EMAIL_MAX_LENGTH } from '@shared/input-validation/is-valid-email';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@shared/input-validation/is-valid-username';
import {
  FIRSTNAME_MIN_LENGTH,
  FIRSTNAME_MAX_LENGTH,
} from '@shared/input-validation/is-valid-firstname';
import {
  LASTNAME_MIN_LENGTH,
  LASTNAME_MAX_LENGTH,
} from '@shared/input-validation/is-valid-lastname';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@shared/input-validation/is-valid-password';

export const CreateUserDtoSchema = z.object({
  email: z.email().max(EMAIL_MAX_LENGTH),
  username: z.string().trim().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH),
  firstName: z
    .string()
    .trim()
    .min(FIRSTNAME_MIN_LENGTH)
    .max(FIRSTNAME_MAX_LENGTH),
  lastName: z.string().trim().min(LASTNAME_MIN_LENGTH).max(LASTNAME_MAX_LENGTH),
  passwd: z.string().max(PASSWORD_MAX_LENGTH),
  confirmPasswd: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});
