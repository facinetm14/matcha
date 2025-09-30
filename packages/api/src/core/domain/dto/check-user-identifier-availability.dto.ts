import * as z from 'zod';
import { UserIdentifier } from '@shared/user-identifier';

export const CheckUserIdentifierAvailabilityDtoSchema = z.object({
  field: z.enum(UserIdentifier),
  value: z.string(),
});

export type CheckUserIdentifierAvailabilityDto = z.infer<
  typeof CheckUserIdentifierAvailabilityDtoSchema
>;
