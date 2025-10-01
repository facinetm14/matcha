import { defineStore } from 'pinia'
import { authApi } from '@/api/auth.api'
import { Ok, Err } from '@/utils/result';
import type { Result } from '@/utils/result';
import type { CreateUserDto } from '@/dto/create-user.dto';

enum AuthApiError {
 REGISTRATION_FAILED = 'REGISTRATION_FAILED',
 VERIFY_FAILED = 'VERIFY_FAILED'
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
   }
  },

});
