export const extractFileExtension = (path: string): string => {
  return path.substring(path.lastIndexOf(".") + 1);
};
