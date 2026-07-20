export interface PasswordHasher {
  hash(plainTextPassword: string): Promise<string>;
  verify(hashedPassword: string, plainTextPassword: string): Promise<boolean>;
}
