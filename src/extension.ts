import * as vscode from 'vscode';
import * as commands from './commands';

const extensionId = 'orestesgaolin.dart-export-index';

export function activate(context: vscode.ExtensionContext) {
  const showInfoNotification = vscode.commands.registerCommand('extension.showInfo', async () => {
    const selection = await vscode.window.showInformationMessage('Extension has been updated. Recursive export and ignore patters are now available. Check the extension settings for details.', 'Open settings');

    if (selection) {
      await vscode.commands.executeCommand('workbench.action.openSettings', 'dartBarrelExportFileGenerator');
    }
  });

  const addCurrentFileDirName = vscode.commands.registerCommand(
    'extension.addCurrentFileToIndexDartDirName',
    () => {
      commands.addCurrentFileToDartExportFile();
    },
  );

  const exportAllFilesDirName = vscode.commands.registerCommand(
    'extension.exportDartFilesInCurrentDirectoryDirName',
    () => {
      commands.exportDartFilesInCurrentDirectoryDirName();
    },
  );

  context.subscriptions.push(addCurrentFileDirName);
  context.subscriptions.push(exportAllFilesDirName);
  context.subscriptions.push(showInfoNotification);
  // show notification on start

  const previousVersion = context.globalState.get<string>(extensionId);
  const currentVersion = vscode.extensions.getExtension(extensionId)!.packageJSON.version;
  // store latest version
  context.globalState.update(extensionId, currentVersion);

  if (previousVersion === undefined) {
    vscode.commands.executeCommand('extension.showInfo');
  }
}

export function deactivate() { }
