import * as path from 'path';
import * as vscode from 'vscode';
import {
  fileIsOpened,
  fileIsSaved,
  getCurrentFilePath,
} from '../utils/editor-helper';
import { ApplicationError } from '../utils/errors';
import {
  createFileIfNotExists,
  clearFile,
  getLines,
  isDirectory,
  writeFile,
  listFiles,
} from '../utils/file-manager';
import { isDart, isGenerated } from '../utils/file-name';

type PathBuilder = (writpPath: string) => string;

const exportFileName = 'index.dart';

export const exportAllFilesBelowToDirNameDart = () => {
  exportFilesBelowToPath((filePath) => getDirNamePath(filePath));
};

export const exportAllFilesBelowToIndexDart = () => {
  exportFilesBelowToPath((filePath) => getIndexPath(filePath));
};

const exportFilesBelowToPath = (writePathBuilder: PathBuilder) => {
  try {
    const filePath = getCurrentFilePath();

    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }

    const writePath = writePathBuilder(filePath);
    const dirPath = path.dirname(filePath);

    let files: string[] = [];
    let directories: string[] = [dirPath];

    while (directories.length > 0) {
      const currentDir = directories.pop();
      if (!currentDir) {
        break;
      }
      const currentElements = getElementsFromPath(currentDir);
      directories = [...directories, ...currentElements[0]];
      files = [...files, ...currentElements[1]].filter(
        (el) => el !== writePath,
      );
    }

    createFileIfNotExists(writePath);

    files.forEach((path) => {
      const exportationLine = getExportationLineFromLocalPath(
        path,
        `${dirPath}/`,
      );
      writeLineAndSort(writePath, exportationLine);
    });
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

export const addCurrentFileToIndexDart = () => {
  try {
    const filePath = getFilePath();

    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }

    if (!filePath.endsWith('.dart')) {
      throw new ApplicationError('The file is not Dart file.');
    }

    const indexFilePath = getIndexPath(filePath);

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is the index file itself.');
    }

    createFileIfNotExists(indexFilePath);

    const exportationLine = getExportationLine(filePath);
    writeLineAndSort(indexFilePath, exportationLine);
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

export const addCurrentFileToIndexDartDirName = () => {
  try {
    const filePath = getFilePath();

    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }

    if (!filePath.endsWith('.dart')) {
      throw new ApplicationError('The file is not Dart file.');
    }

    const indexFilePath = getDirNamePath(filePath);

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is the index file itself.');
    }

    createFileIfNotExists(indexFilePath);

    const exportationLine = getExportationLine(filePath);
    writeLineAndSort(indexFilePath, exportationLine);
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

export const exportDartFilesInCurrentDirectory = () => {
  try {
    const files = getCurrentDirectoryDartFiles();
    const filePath = getFilePath();
    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }
    const indexFilePath = getIndexPath(filePath);
    createFileIfNotExists(indexFilePath);
    clearFile(indexFilePath);

    files.forEach((f) => {
      if (f === exportFileName) {
        return;
      }
      const exportationLine = getExportationLine(f);
      writeLineAndSort(indexFilePath, exportationLine);
    });

  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

export const exportDartFilesInCurrentDirectoryDirName = () => {
  try {
    const files = getCurrentDirectoryDartFiles();
    const filePath = getFilePath();
    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }
    const indexFilePath = getDirNamePath(filePath);
    createFileIfNotExists(indexFilePath);
    clearFile(indexFilePath);

    files.forEach((f) => {
      if (f === exportFileName || f === path.basename(indexFilePath)) {
        return;
      }
      const exportationLine = getExportationLine(f);
      writeLineAndSort(indexFilePath, exportationLine);
    });

  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

const getFilePath = (): string | null => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened.');
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet.');
  }

  return getCurrentFilePath();
};

const getCurrentDirectoryDartFiles = (): string[] => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened.');
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet.');
  }

  const filePath = getCurrentFilePath();
  if (filePath === null) {
    throw new ApplicationError('Could not get current file path');
  }
  const dirPath = path.dirname(filePath);

  const files = listFiles(dirPath);
  const dartFiles = files.filter((f) => isDart(f) && !isGenerated(f));
  return dartFiles;
};

/**
 * Gets files and directories split from the [dirPath]
 * @param dirPath
 * @returns a Tuple storing directory paths on index 0, and files path on index 1.
 */
const getElementsFromPath = (dirPath: string): [string[], string[]] => {
  const files = listFiles(dirPath);
  return [
    files.map((name) => `${dirPath}/${name}`).filter(isDirectory),
    files
      .map((name) => `${dirPath}/${name}`)
      .filter((name) => isDart(name) && !isGenerated(name)),
  ];
};

const getIndexPath = (filePath: string): string => {
  const dirPath = path.dirname(filePath);
  return path.join(dirPath, `${exportFileName}`);
};

const getDirNamePath = (filePath: string): string => {
  const dirPath = path.dirname(filePath);
  const elements = dirPath.split('/');
  const dirName = elements[elements.length - 1];
  return path.join(dirPath, `${dirName}.dart`);
};

const getExportationLine = (filePath: string): string => {
  const fileName = path.basename(filePath);
  return `export '${fileName}';`;
};
const getExportationLineFromLocalPath = (
  filePath: string,
  localPath: string,
): string => {
  if (path.dirname(filePath) === localPath) {
    return getExportationLine(filePath);
  }

  const fileName = filePath.replace(localPath, '');
  return `export '${fileName}';`;
};

const writeLineAndSort = (filePath: string, line: string): void => {
  const lines = getLines(filePath).filter(l => l !== '');

  if (!lines.includes(line)) {
    lines.push(line);
  }

  lines.sort();
  const written = `${lines.join('\n')}\n`;

  writeFile(filePath, written);
};