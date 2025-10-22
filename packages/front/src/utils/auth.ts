import { toast } from 'sonner';
import type { NavigateFunction } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserIdentifier } from '../../../shared/user-identifier';
import { userApi } from '@/api/user.api';
import { authApi } from '@/api/auth.api';

export function logout(navigate: NavigateFunction) {
  localStorage.removeItem('isLoggedIn');
  useAuthStore.getState().updateLoginStatus(false);
  toast.success("You're logged out.");
  authApi.logout();
  navigate('/login');
}

export async function isUserIdentifierAvailable(identifier: UserIdentifier, value: string): Promise<boolean> {
  const checkResult = await userApi.checkUserIdentifierAvailability(identifier, value);
  if (checkResult.status === 200) {
    const data = await checkResult.json();
    return data.available;
  }
  toast.error(`Failed to check ${identifier} availability. Please try again later.`);
  return false;
}