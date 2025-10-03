import type { CreateUserDto } from '@/types/dto/create-user.dto';

const API_BASE_ROUTE = import.meta.env.VITE_API_BASE_ROUTE || '/api/v1';

const register = async (user: CreateUserDto) => {
  return fetch(`${API_BASE_ROUTE}/auth/register`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  });
};

const verify = async (token: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/verify/${token}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
};

const confirmResetPassword = async (token: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/confirm-reset-password/${token}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
};

const updatePassword = async (id: string, passwd: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/new-password`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({ passwd, id }),
  });
};

const signIn = async (username: string, passwd: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ username, passwd }),
  });
};

const sendResetPasswordRequest = async (email: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/reset-password`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

const createNewPassword = async (passwd: string, confirmPasswd: string) => {
  return fetch(`${API_BASE_ROUTE}/auth/create-new-password`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ passwd, confirmPasswd }),
    credentials: 'include',
  });
};

export const authApi = {
  register,
  verify,
  updatePassword,
  signIn,
  sendResetPasswordRequest,
  confirmResetPassword,
  createNewPassword,
};
