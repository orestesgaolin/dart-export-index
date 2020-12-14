import * as fs from 'fs';
import { ApplicationError } from './errors';

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

export const getLines = (filePath: string): string[] => {
  return fs.readFileSync(filePath, 'utf-8').split('\n');
};

export const writeFile = (filePath: string, data: string): void => {
  fs.writeFileSync(filePath, data);
};

export class FileAlreadyExistsError extends ApplicationError { }
