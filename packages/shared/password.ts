import argon2 from 'argon2';

export const MIN_SIZE_PASSWORD = 12;

export function isPasswordStrong(passwd: string, minLength: number): boolean {
  const rulePattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9_]).+$/;

  const passwdRegex = new RegExp(rulePattern);

  return passwd.length >= minLength && !!passwd.match(passwdRegex);
}

export async function hashPassword(passwd: string): Promise<string> {
  return argon2.hash(passwd);
}

export async function verifyPassword(
  hashPassword: string,
  plainTextPassword: string,
): Promise<boolean> {
  return argon2.verify(hashPassword, plainTextPassword);
}
