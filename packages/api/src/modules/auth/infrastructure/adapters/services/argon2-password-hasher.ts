import { injectable } from 'inversify';
import { PasswordHasher } from '@/modules/auth/application/ports/services/password-hasher';
import {
  hashPassword,
  verifyPassword,
} from '@/modules/auth/infrastructure/utils/password';

@injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  async hash(plainTextPassword: string): Promise<string> {
    return hashPassword(plainTextPassword);
  }

  async verify(
    hashedPassword: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    return verifyPassword(hashedPassword, plainTextPassword);
  }
}
