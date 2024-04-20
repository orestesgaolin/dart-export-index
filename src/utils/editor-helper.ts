import * as vscode from 'vscode';
import { ApplicationError } from './errors';

export const fileIsOpened = (): boolean => {
  return !!vscode.window.activeTextEditor;
};


/// Returns true if the current file is saved, false otherwise
export const fileIsSaved = (): boolean => {
  if (!fileIsOpened) {
    return false;
  }

  const editor = vscode.window.activeTextEditor;

  if (editor === undefined) {
    throw new ApplicationError('No active editor available');
  }

  const document = editor.document;
  return !document.isUntitled;
};


/// Returns the current file path or null if the file is not opened or not saved
export const getCurrentFilePath = (): string | null => {
  if (!(fileIsOpened() && fileIsSaved())) {
    return null;
  };

  const editor = vscode.window.activeTextEditor;

  if (editor === undefined) {
    throw new ApplicationError('No active editor available');
  }

  return editor.document.fileName;
};
