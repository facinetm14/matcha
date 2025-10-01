import { defineStore } from 'pinia'
import { authApi } from '@/api/auth.api'
import { Ok, Err } from '@/utils/result';
import type { Result } from '@/utils/result';
import type { CreateUserDto } from '@/dto/create-user.dto';

enum AuthApiError {
 REGISTRATION_FAILED = 'REGISTRATION_FAILED',
 VERIFY_FAILED = 'VERIFY_FAILED',
 SIGNIN_FAILED = 'SIGNIN_FAILED'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
  }),
  actions: {
    async register(newUser: CreateUserDto): Promise<Result<null, AuthApiError>>{
      const registerUserResult = await authApi.register(newUser);

      if (registerUserResult.status === 201) {
        return Ok(null);
      }

      return Err(AuthApiError.REGISTRATION_FAILED)
    },

   async verify(token: string): Promise<Result<null, AuthApiError>> {
    const verifyEmailResult = await authApi.verify(token);

    if (verifyEmailResult.status === 200) {
      return Ok(null);
    }

    return Err(AuthApiError.VERIFY_FAILED)
   },

   async signIn(username: string, passwd: string): Promise<Result<{token: string, refresh: string}, AuthApiError>> {
    const signInResult = await authApi.signIn(username, passwd);

    if (signInResult.status === 200) {
      const { token, refresh } = await signInResult.json();
      return Ok({ token, refresh });
    }

    return Err(AuthApiError.SIGNIN_FAILED)
  }

  },

});
