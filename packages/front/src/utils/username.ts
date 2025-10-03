import { useUserStore } from '@/stores/user-pinia';
import { UserIdentifier } from '../../../shared/user-identifier';

export const MIN_SIZE_USERNAME = 3;

export function isValidUsername(
  username: string,
  minLength = MIN_SIZE_USERNAME,
): boolean {
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  const usernameRegex = new RegExp(usernamePattern);

  return username.length >= minLength && !!username.match(usernameRegex);
}

export const isUsernameAvailable = (username: string): Promise<boolean> => {
  return useUserStore().checkUserIdentifierAvailability(
    UserIdentifier.USERNAME,
    username,
  );
};
