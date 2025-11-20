import argon2 from 'argon2';

export async function hashPassword(passwd: string): Promise<string> {
  return argon2.hash(passwd);
}

export async function verifyPassword(
  hashPassword: string,
  plainTextPassword: string,
): Promise<boolean> {
  return argon2.verify(hashPassword, plainTextPassword);
}