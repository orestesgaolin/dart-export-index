import * as path from 'path';
import * as fs from 'fs';
import { ApplicationError } from './errors';
import glob = require('glob');

export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

export const createFile = (filePath: string): void => {
  if (fileExists(filePath)) {
    throw new FileAlreadyExistsError(`${filePath} already exists`);
  }

  fs.appendFileSync(filePath, '', 'utf-8');
};

export const listFiles = (dirPath: string): string[] => {
  return fs.readdirSync(dirPath);
};

export const createFileIfNotExists = (filePath: string): void => {
  if (fileExists(filePath)) {
    return;
  }

  createFile(filePath);
};

export const clearFile = (filePath: string): void => {
  if (fileExists(filePath)) {
    fs.writeFileSync(filePath, '');
  }
};

export const getDartFilesAndDirectories = (
  directory: string,
  ignorePatterns: string[],
  exportFilePath: string
): { dartFiles: string[], directories: string[] } => {
  const ignorePatternsToUse = ignorePatterns.map(pattern => path.join(directory, pattern));

  const dartFiles = glob.sync(`${directory}/*.dart`, { ignore: [...ignorePatternsToUse, exportFilePath] });
  const directories = fs.readdirSync(directory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(directory, dirent.name));

  return { dartFiles, directories };
};

export const getDirectoryNameFromDirectory = (directory: string): string => {
  const elements = directory.split('/');
  return elements[elements.length - 1];
};

export const getLines = (filePath: string): string[] => {
  return fs.readFileSync(filePath, 'utf-8').split('\n');
};

export const writeFile = (filePath: string, data: string): void => {
  fs.writeFileSync(filePath, data);
};

export const writeLineAndSort = (filePath: string, line: string): void => {
  const lines = getLines(filePath).filter(l => l !== '');

  if (!lines.includes(line)) {
    lines.push(line);
  }

  lines.sort();
  const written = `${lines.join('\n')}\n`;

  writeFile(filePath, written);
};

export class FileAlreadyExistsError extends ApplicationError { }
