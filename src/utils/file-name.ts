export const getExtension = (filePath: string): string | null => {
  const match = filePath.match(/.*\.(.+)/);

  if (!match) {
    return null;
  }

  return match[1];
};

export const isDart = (filePath: string): boolean => {
  return filePath.endsWith('.dart');
};
export const isGenerated = (filePath: string): boolean => {
  return filePath.endsWith('.g.dart') || filePath.endsWith('.freezed.dart');
};
