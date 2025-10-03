import { useUserStore } from '@/stores/user-pinia';
import { UserIdentifier } from '../../../shared/user-identifier';

export const isEmailAvailable = async (email: string): Promise<boolean> => {
  return useUserStore().checkUserIdentifierAvailability(
    UserIdentifier.EMAIL,
    email,
  );
};
