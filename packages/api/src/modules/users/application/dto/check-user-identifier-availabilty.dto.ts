import { UserIdentifier } from '@shared/user-identifier';

export interface CheckUserIdentifierAvailabilityDto {
  field: UserIdentifier;
  value: string;
}
