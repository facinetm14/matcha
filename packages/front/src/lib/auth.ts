import { toast } from 'sonner';
import type { NavigateFunction } from 'react-router-dom';

export function logout(navigate: NavigateFunction) {
  localStorage.removeItem('isAuthenticated');
  toast.success('Logged out successfully');
  navigate('/login');
}

export const MIN_SIZE_PASSWORD = 12;

export function isPasswordStrong(passwd: string, minLength: number): boolean {
  const rulePattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9_]).+$/;

  const passwdRegex = new RegExp(rulePattern);

  return passwd.length >= minLength && !!passwd.match(passwdRegex);
}