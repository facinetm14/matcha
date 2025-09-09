export const MIN_SIZE_PASSWORD = 12;

export const isPasswordStrong = (
  passwd: string,
  minLength: number
): boolean => {
  const rulePattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9_]).+$/;

  const passwdRegex = new RegExp(rulePattern);

  return passwd.length >= minLength && !!passwd.match(passwdRegex);
};

