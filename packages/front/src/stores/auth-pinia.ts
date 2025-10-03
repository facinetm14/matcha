import { defineStore } from 'pinia';
import { authApi } from '@/api/auth.api';
import { Ok, Err } from '@/utils/result';
import type { Result } from '@/utils/result';
import type { CreateUserDto } from '@/types/dto/create-user.dto';

export enum AuthApiError {
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  VERIFY_FAILED = 'VERIFY_FAILED',
  SIGNIN_FAILED = 'SIGNIN_FAILED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  FAILED_TO_SEND_RESET_PASSWORD_LINK = 'RESET_PASSWORD_WISHED_BY_USER',
  NEW_PASSWORD_CREATION_FAILED = 'NEW_PASSWORD_CREATION_FAILED',
}

export const useAuthStore = defineStore('auth', {
  state: () => ({}),

  actions: {
    async register(
      newUser: CreateUserDto,
    ): Promise<Result<null, AuthApiError>> {
      const registerUserResult = await authApi.register(newUser);

      if (registerUserResult.status === 201) {
        return Ok(null);
      }

      return Err(AuthApiError.REGISTRATION_FAILED);
    },

    async verify(token: string): Promise<Result<null, AuthApiError>> {
      const verifyEmailResult = await authApi.verify(token);

      if (verifyEmailResult.status === 200) {
        return Ok(null);
      }

      return Err(AuthApiError.VERIFY_FAILED);
    },

    async confirmResetPassword(
      token: string,
    ): Promise<Result<null, AuthApiError>> {
      const verifyEmailResult = await authApi.confirmResetPassword(token);

      if (verifyEmailResult.status === 200) {
        return Ok(null);
      }

      return Err(AuthApiError.VERIFY_FAILED);
    },

    async signIn(
      username: string,
      passwd: string,
    ): Promise<Result<null, AuthApiError>> {
      const signInResult = await authApi.signIn(username, passwd);

      if (signInResult.status === 200) {
        return Ok(null);
      }

      return Err(AuthApiError.SIGNIN_FAILED);
    },

    async sendResetPasswordLink(
      email: string,
    ): Promise<Result<null, AuthApiError>> {
      const resetPasswordResult = await authApi.sendResetPasswordRequest(email);
      if (resetPasswordResult.status === 200) {
        return Ok(null);
      }

      if (resetPasswordResult.status === 404) {
        return Err(AuthApiError.USER_NOT_FOUND);
      }

      return Err(AuthApiError.FAILED_TO_SEND_RESET_PASSWORD_LINK);
    },

    async createNewPassword(
      passwd: string,
      confirmPasswd: string,
    ): Promise<Result<null, AuthApiError>> {
      const createNewPasswordResult = await authApi.createNewPassword(
        passwd,
        confirmPasswd,
      );

      if (createNewPasswordResult.status === 200) {
        return Ok(null);
      }

      return Err(AuthApiError.NEW_PASSWORD_CREATION_FAILED);
    },
  },
});
