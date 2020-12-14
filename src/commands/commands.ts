import * as path from 'path'
import * as vscode from 'vscode'
import {
  fileIsOpened,
  fileIsSaved,
  getCurrentFilePath,
} from '../utils/editor-helper'
import { ApplicationError } from '../utils/errors'
import {
  createFileIfNotExists,
  clearFile,
  getLines,
  writeFile,
  listFiles,
} from '../utils/file-manager'
import { getExtension } from '../utils/file-name'

const isDart = /\.dart?$/g;
const exportFileName = 'index.dart'

export const addCurrentFileToIndexDart = () => {
  try {
    const filePath = getFilePath()

    if (!filePath.match(isDart)) {
      throw new ApplicationError('The file is not Dart file.')
    }

    const indexFilePath = getIndexPath(filePath)

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is the index file itself.')
    }

    createFileIfNotExists(indexFilePath)

    const exportationLine = getExportationLine(filePath)
    writeLineAndSort(indexFilePath, exportationLine)
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message)
      return
    }

    throw err
  }
}

export const addCurrentFileToIndexDartDirName = () => {
  try {
    const filePath = getFilePath()

    if (!filePath.match(isDart)) {
      throw new ApplicationError('The file is not Dart file.')
    }

    const indexFilePath = getDirNamePath(filePath)

    if (filePath === indexFilePath) {
      throw new ApplicationError('The file is the index file itself.')
    }

    createFileIfNotExists(indexFilePath)

    const exportationLine = getExportationLine(filePath)
    writeLineAndSort(indexFilePath, exportationLine)
  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message)
      return
    }

    throw err
  }
}

export const exportDartFilesInCurrentDirectory = () => {
  try {
    const files = getCurrentDirectoryDartFiles()
    const filePath = getFilePath()
    const indexFilePath = getIndexPath(filePath)
    createFileIfNotExists(indexFilePath)
    clearFile(indexFilePath)

    files.forEach((f) => {
      if (f === exportFileName) {
        return
      }
      const exportationLine = getExportationLine(f)
      writeLineAndSort(indexFilePath, exportationLine)
    })

  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message)
      return
    }

    throw err
  }
}

export const exportDartFilesInCurrentDirectoryDirName = () => {
  try {
    const files = getCurrentDirectoryDartFiles()
    const filePath = getFilePath()
    const indexFilePath = getDirNamePath(filePath)
    createFileIfNotExists(indexFilePath)
    clearFile(indexFilePath)

    files.forEach((f) => {
      if (f === exportFileName || f === path.basename(indexFilePath)) {
        return
      }
      const exportationLine = getExportationLine(f)
      writeLineAndSort(indexFilePath, exportationLine)
    })

  } catch (err) {
    if (err instanceof ApplicationError) {
      vscode.window.showErrorMessage(err.message)
      return
    }

    throw err
  }
}

const getFilePath = (): string => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened.')
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet.')
  }

  return getCurrentFilePath()
}

const getCurrentDirectoryDartFiles = (): string[] => {
  if (!fileIsOpened()) {
    throw new ApplicationError('No file is opened.')
  }

  if (!fileIsSaved()) {
    throw new ApplicationError('The file is not saved yet.')
  }

  const filePath = getCurrentFilePath()
  const dirPath = path.dirname(filePath)
  const files = listFiles(dirPath)
  const dartFiles = files.filter((f) => f.match(isDart))
  return dartFiles
}

const getIndexPath = (filePath: string): string => {
  const dirPath = path.dirname(filePath)
  return path.join(dirPath, `${exportFileName}`)
}

const getDirNamePath = (filePath: string): string => {
  const dirPath = path.dirname(filePath)
  const elements = dirPath.split('/')
  const dirName = elements[elements.length - 1]
  return path.join(dirPath, `${dirName}.dart`)
}

const getExportationLine = (filePath: string): string => {
  const fileName = path.basename(filePath)
  return `export '${fileName}';`
}

const writeLineAndSort = (filePath: string, line: string): void => {
  const lines = getLines(filePath).filter(l => l !== '')

  if (!lines.includes(line)) {
    lines.push(line)
  }

  lines.sort()
  const written = `${lines.join('\n')}\n`

  writeFile(filePath, written)
}