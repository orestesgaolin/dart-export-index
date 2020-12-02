import * as vscode from 'vscode'
import * as commands from './commands'

export function activate(context: vscode.ExtensionContext) {
  const addCurrentFile = vscode.commands.registerCommand(
    'extension.addCurrentFileToIndexDart',
    () => {
      commands.addCurrentFileToIndexDart()
    },
  )

  const exportAllFiles = vscode.commands.registerCommand(
    'extension.exportDartFilesInCurrentDirectory',
    () => {
      commands.exportDartFilesInCurrentDirectory()
    },
  )

  context.subscriptions.push(addCurrentFile)
  context.subscriptions.push(exportAllFiles)
}

export function deactivate() { }
