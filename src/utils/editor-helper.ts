import * as vscode from 'vscode';
import { ApplicationError } from './errors';

export const fileIsOpened = (): boolean => {
  return !!vscode.window.activeTextEditor;
};

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

export const getCurrentFilePath = (): string | null => {
  if (!(fileIsOpened && fileIsSaved)) {
    return null;
  };

  const editor = vscode.window.activeTextEditor;

  if (editor === undefined) {
    throw new ApplicationError('No active editor available');
  }

  return editor.document.fileName;
};
