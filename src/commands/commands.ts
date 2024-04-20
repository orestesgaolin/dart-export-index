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
  getDartFilesAndDirectories,
  getDirectoryNameFromDirectory,
  writeLineAndSort,
} from '../utils/file-manager';


export const addCurrentFileToDartExportFile = () => {
  try {
    const filePath = getFilePath();

    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }

    if (!filePath.endsWith('.dart')) {
      throw new ApplicationError('The file is not Dart file.');
    }

    const config = vscode.workspace.getConfiguration('dartBarrelExportFileGenerator');
    const exportFileName = config.get<string>('exportFileName');

    const directory = path.dirname(filePath);
    const exportFilePath = getExportFilePathFromDirectory(directory, exportFileName);

    if (filePath === exportFilePath) {
      throw new ApplicationError('The file is the index file itself.');
    }

    createFileIfNotExists(exportFilePath);

    const exportationLine = getExportationLine(filePath);
    writeLineAndSort(exportFilePath, exportationLine);
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
    const config = vscode.workspace.getConfiguration('dartBarrelExportFileGenerator');

    const filePath = getFilePath();
    if (filePath === null) {
      throw new ApplicationError('Could not get current file path');
    }
    console.log(`filePath: ${filePath}`);
    const directory = path.dirname(filePath);
    exportDartFilesFromDirectory(directory, config);

  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message);
      return;
    }

    throw err;
  }
};

async function exportDartFilesFromDirectory(directory: string, config: vscode.WorkspaceConfiguration) {
  const exportFileNameConfig = config.get<string>('exportFileName') || 'dir_name.dart';
  const ignorePatterns = config.get<string[]>('ignorePatterns') || [];
  const recursiveExport = config.get<boolean>('recursiveExport') || false;

  console.log(`exportFileName: ${exportFileNameConfig}`);
  console.log(`ignorePatterns: ${ignorePatterns}`);
  console.log(`recursiveExport: ${recursiveExport}`);

  // Define the index file path for the current directory
  const exportFilePath = getExportFilePathFromDirectory(directory, exportFileNameConfig);
  createFileIfNotExists(exportFilePath);
  clearFile(exportFilePath);

  // Get all Dart files and directories except the index file itself
  const { dartFiles, directories } = getDartFilesAndDirectories(directory, ignorePatterns, exportFilePath);

  // Write export lines for Dart files in the current directory
  dartFiles.forEach(file => {
    const exportationLine = getExportationLine(file);
    writeLineAndSort(exportFilePath, exportationLine);
  });

  if (recursiveExport) {
    // Recursively handle subdirectories and add their exports to the current index
    for (const subdirectory of directories) {
      const basename = path.basename(subdirectory);
      const subExportFilePath = getExportFilePathFromDirectory(subdirectory, exportFileNameConfig);
      await exportDartFilesFromDirectory(subdirectory, config); // Recurse into subdirectory

      // export dir_name/dir_name.dart or any other file name
      // can be taken from 2 last parts of exportFilePath 
      const subExportFileName = subExportFilePath.split('/').slice(-2).join('/');
      const exportationLine = `export '${subExportFileName}';`;
      writeLineAndSort(exportFilePath, exportationLine);
    }
  }
}

const getFilePath = (): string | null => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened. Make sure to execute this command in a Dart file.');
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet. Save the file before executing this command.');
  }

  return getCurrentFilePath();
};

const getExportFilePathFromDirectory = (directory: string, exportFileName: string | undefined): string => {
  let shouldUseDirectoryName = exportFileName === undefined
    || exportFileName === ''
    || exportFileName === null
    || exportFileName === 'dir_name.dart';

  if (shouldUseDirectoryName) {
    const directoryName = getDirectoryNameFromDirectory(directory);
    return path.join(directory, `${directoryName}.dart`);
  }

  return path.join(directory, `${exportFileName}`);
};

const getExportationLine = (filePath: string): string => {
  const fileName = path.basename(filePath);
  return `export '${fileName}';`;
};
