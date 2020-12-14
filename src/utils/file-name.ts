export const getExtension = (filePath: string): string | null => {
  const match = filePath.match(/.*\.(.+)/);

  if (!match) {
    return null;
  }

  return match[1];
};
