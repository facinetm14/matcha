export const MIN_SIZE_USERNAME = 3;

export function isValidUsername(
  username: string,
  minLength = MIN_SIZE_USERNAME,
): boolean {
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  const usernameRegex = new RegExp(usernamePattern);

  return username.length >= minLength && !!username.match(usernameRegex);
}
