import { UserIdentifier } from '../../../shared/user-identifier';

const API_BASE_ROUTE = import.meta.env.VITE_API_BASE_ROUTE || '/api/v1';

const getMe = async () => {
  return fetch(`${API_BASE_ROUTE}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
};

const checkUserIdentifierAvailability = async (
  field: UserIdentifier,
  value: string,
) => {
  return fetch(`${API_BASE_ROUTE}/users/check-identifier`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ field, value }),
  });
};

export const userApi = {
  getMe,
  checkUserIdentifierAvailability,
};
