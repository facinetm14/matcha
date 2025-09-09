export const isValidEmail = (email: string): boolean => {
  const patterns = /^[^\s@]+@[^\s@]+\.[^\s@]/;
  const emailRegex = new RegExp(patterns);
  return !!email.match(emailRegex);
};
