export const isValidEmail = async (email: string): Promise<boolean> => {
  const patterns = /^[^\s@]+@[^\s@]+\.[^\s@]/;
  const emailRegex = new RegExp(patterns);

  return !!email.match(emailRegex);
};
