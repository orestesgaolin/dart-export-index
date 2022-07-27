import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
  const addCurrentFile = vscode.commands.registerCommand(
    'extension.addCurrentFileToIndexDart',
    () => {
      commands.addCurrentFileToIndexDart();
    },
  );

  const addCurrentFileDirName = vscode.commands.registerCommand(
    'extension.addCurrentFileToIndexDartDirName',
    () => {
      commands.addCurrentFileToIndexDartDirName();
    },
  );

  const exportAllFiles = vscode.commands.registerCommand(
    'extension.exportDartFilesInCurrentDirectory',
    () => {
      commands.exportDartFilesInCurrentDirectory();
    },
  );

  const exportAllFilesDirName = vscode.commands.registerCommand(
    'extension.exportDartFilesInCurrentDirectoryDirName',
    () => {
      commands.exportDartFilesInCurrentDirectoryDirName();
    },
  );

  const exportAllFilesBelow = vscode.commands.registerCommand(
    'extension.exportDartFilesFromSubdirectoriesInCurrentDirectory',
    () => {
      commands.exportAllFilesBelowToIndexDart();
    },
  );

  const exportAllFilesBelowDirName = vscode.commands.registerCommand(
    'extension.exportDartFilesFromSubdirectoriesInCurrentDirectoryDirName',
    () => {
      commands.exportAllFilesBelowToDirNameDart();
    },
  );

  context.subscriptions.push(addCurrentFile);
  context.subscriptions.push(addCurrentFileDirName);
  context.subscriptions.push(exportAllFiles);
  context.subscriptions.push(exportAllFilesDirName);
  context.subscriptions.push(exportAllFilesBelow);
  context.subscriptions.push(exportAllFilesBelowDirName);
}

export function deactivate() { }
