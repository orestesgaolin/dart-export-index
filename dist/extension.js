/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3), exports);


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportDartFilesInCurrentDirectoryDirName = exports.exportDartFilesInCurrentDirectory = exports.addCurrentFileToIndexDartDirName = exports.addCurrentFileToIndexDart = exports.exportAllFilesBelowToIndexDart = exports.exportAllFilesBelowToDirNameDart = void 0;
const path = __webpack_require__(4);
const vscode = __webpack_require__(1);
const editor_helper_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(6);
const file_manager_1 = __webpack_require__(7);
const file_name_1 = __webpack_require__(9);
const exportFileName = 'index.dart';
const exportAllFilesBelowToDirNameDart = () => {
    exportFilesBelowToPath((filePath) => getDirNamePath(filePath));
};
exports.exportAllFilesBelowToDirNameDart = exportAllFilesBelowToDirNameDart;
const exportAllFilesBelowToIndexDart = () => {
    exportFilesBelowToPath((filePath) => getIndexPath(filePath));
};
exports.exportAllFilesBelowToIndexDart = exportAllFilesBelowToIndexDart;
const exportFilesBelowToPath = (writePathBuilder) => {
    try {
        const filePath = (0, editor_helper_1.getCurrentFilePath)();
        if (filePath === null) {
            throw new errors_1.ApplicationError('Could not get current file path');
        }
        const writePath = writePathBuilder(filePath);
        const dirPath = path.dirname(filePath);
        let files = [];
        let directories = [dirPath];
        while (directories.length > 0) {
            const currentDir = directories.pop();
            if (!currentDir) {
                break;
            }
            const currentElements = getElementsFromPath(currentDir);
            directories = [...directories, ...currentElements[0]];
            files = [...files, ...currentElements[1]].filter((el) => el !== writePath);
        }
        (0, file_manager_1.createFileIfNotExists)(writePath);
        files.forEach((path) => {
            const exportationLine = getExportationLineFromLocalPath(path, `${dirPath}/`);
            writeLineAndSort(writePath, exportationLine);
        });
    }
    catch (err) {
        if (err instanceof errors_1.ApplicationError) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
        throw err;
    }
};
const addCurrentFileToIndexDart = () => {
    try {
        const filePath = getFilePath();
        if (filePath === null) {
            throw new errors_1.ApplicationError('Could not get current file path');
        }
        if (!filePath.endsWith('.dart')) {
            throw new errors_1.ApplicationError('The file is not Dart file.');
        }
        const indexFilePath = getIndexPath(filePath);
        if (filePath === indexFilePath) {
            throw new errors_1.ApplicationError('The file is the index file itself.');
        }
        (0, file_manager_1.createFileIfNotExists)(indexFilePath);
        const exportationLine = getExportationLine(filePath);
        writeLineAndSort(indexFilePath, exportationLine);
    }
    catch (err) {
        if (err instanceof errors_1.ApplicationError) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
        throw err;
    }
};
exports.addCurrentFileToIndexDart = addCurrentFileToIndexDart;
const addCurrentFileToIndexDartDirName = () => {
    try {
        const filePath = getFilePath();
        if (filePath === null) {
            throw new errors_1.ApplicationError('Could not get current file path');
        }
        if (!filePath.endsWith('.dart')) {
            throw new errors_1.ApplicationError('The file is not Dart file.');
        }
        const indexFilePath = getDirNamePath(filePath);
        if (filePath === indexFilePath) {
            throw new errors_1.ApplicationError('The file is the index file itself.');
        }
        (0, file_manager_1.createFileIfNotExists)(indexFilePath);
        const exportationLine = getExportationLine(filePath);
        writeLineAndSort(indexFilePath, exportationLine);
    }
    catch (err) {
        if (err instanceof errors_1.ApplicationError) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
        throw err;
    }
};
exports.addCurrentFileToIndexDartDirName = addCurrentFileToIndexDartDirName;
const exportDartFilesInCurrentDirectory = () => {
    try {
        const files = getCurrentDirectoryDartFiles();
        const filePath = getFilePath();
        if (filePath === null) {
            throw new errors_1.ApplicationError('Could not get current file path');
        }
        const indexFilePath = getIndexPath(filePath);
        (0, file_manager_1.createFileIfNotExists)(indexFilePath);
        (0, file_manager_1.clearFile)(indexFilePath);
        files.forEach((f) => {
            if (f === exportFileName) {
                return;
            }
            const exportationLine = getExportationLine(f);
            writeLineAndSort(indexFilePath, exportationLine);
        });
    }
    catch (err) {
        if (err instanceof errors_1.ApplicationError) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
        throw err;
    }
};
exports.exportDartFilesInCurrentDirectory = exportDartFilesInCurrentDirectory;
const exportDartFilesInCurrentDirectoryDirName = () => {
    try {
        const files = getCurrentDirectoryDartFiles();
        const filePath = getFilePath();
        if (filePath === null) {
            throw new errors_1.ApplicationError('Could not get current file path');
        }
        const indexFilePath = getDirNamePath(filePath);
        (0, file_manager_1.createFileIfNotExists)(indexFilePath);
        (0, file_manager_1.clearFile)(indexFilePath);
        files.forEach((f) => {
            if (f === exportFileName || f === path.basename(indexFilePath)) {
                return;
            }
            const exportationLine = getExportationLine(f);
            writeLineAndSort(indexFilePath, exportationLine);
        });
    }
    catch (err) {
        if (err instanceof errors_1.ApplicationError) {
            vscode.window.showErrorMessage(err.message);
            return;
        }
        throw err;
    }
};
exports.exportDartFilesInCurrentDirectoryDirName = exportDartFilesInCurrentDirectoryDirName;
const getFilePath = () => {
    if (!(0, editor_helper_1.fileIsOpened)()) {
        throw new errors_1.ApplicationError('No file is opened.');
    }
    if (!(0, editor_helper_1.fileIsSaved)()) {
        throw new errors_1.ApplicationError('The file is not saved yet.');
    }
    return (0, editor_helper_1.getCurrentFilePath)();
};
const getCurrentDirectoryDartFiles = () => {
    if (!(0, editor_helper_1.fileIsOpened)()) {
        throw new errors_1.ApplicationError('No file is opened.');
    }
    if (!(0, editor_helper_1.fileIsSaved)()) {
        throw new errors_1.ApplicationError('The file is not saved yet.');
    }
    const filePath = (0, editor_helper_1.getCurrentFilePath)();
    if (filePath === null) {
        throw new errors_1.ApplicationError('Could not get current file path');
    }
    const dirPath = path.dirname(filePath);
    const files = (0, file_manager_1.listFiles)(dirPath);
    const dartFiles = files.filter((f) => (0, file_name_1.isDart)(f) && !(0, file_name_1.isGenerated)(f));
    return dartFiles;
};
/**
 * Gets files and directories split from the [dirPath]
 * @param dirPath
 * @returns a Tuple storing directory paths on index 0, and files path on index 1.
 */
const getElementsFromPath = (dirPath) => {
    const files = (0, file_manager_1.listFiles)(dirPath);
    return [
        files.map((name) => `${dirPath}/${name}`).filter(file_manager_1.isDirectory),
        files
            .map((name) => `${dirPath}/${name}`)
            .filter((name) => (0, file_name_1.isDart)(name) && !(0, file_name_1.isGenerated)(name)),
    ];
};
const getIndexPath = (filePath) => {
    const dirPath = path.dirname(filePath);
    return path.join(dirPath, `${exportFileName}`);
};
const getDirNamePath = (filePath) => {
    const dirPath = path.dirname(filePath);
    const elements = dirPath.split('/');
    const dirName = elements[elements.length - 1];
    return path.join(dirPath, `${dirName}.dart`);
};
const getExportationLine = (filePath) => {
    const fileName = path.basename(filePath);
    return `export '${fileName}';`;
};
const getExportationLineFromLocalPath = (filePath, localPath) => {
    if (path.dirname(filePath) === localPath) {
        return getExportationLine(filePath);
    }
    const fileName = filePath.replace(localPath, '');
    return `export '${fileName}';`;
};
const writeLineAndSort = (filePath, line) => {
    const lines = (0, file_manager_1.getLines)(filePath).filter((l) => l !== '');
    if (!lines.includes(line)) {
        lines.push(line);
    }
    lines.sort();
    const written = `${lines.join('\n')}\n`;
    (0, file_manager_1.writeFile)(filePath, written);
};


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrentFilePath = exports.fileIsSaved = exports.fileIsOpened = void 0;
const vscode = __webpack_require__(1);
const errors_1 = __webpack_require__(6);
const fileIsOpened = () => {
    return !!vscode.window.activeTextEditor;
};
exports.fileIsOpened = fileIsOpened;
const fileIsSaved = () => {
    if (!exports.fileIsOpened) {
        return false;
    }
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        throw new errors_1.ApplicationError('No active editor available');
    }
    const document = editor.document;
    return !document.isUntitled;
};
exports.fileIsSaved = fileIsSaved;
const getCurrentFilePath = () => {
    if (!((0, exports.fileIsOpened)() && (0, exports.fileIsSaved)())) {
        return null;
    }
    ;
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        throw new errors_1.ApplicationError('No active editor available');
    }
    return editor.document.fileName;
};
exports.getCurrentFilePath = getCurrentFilePath;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationError = void 0;
class ApplicationError {
    constructor(message) {
        this.message = message;
        this.name = 'ApplicationError';
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
exports.ApplicationError = ApplicationError;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileAlreadyExistsError = exports.writeFile = exports.getLines = exports.clearFile = exports.createFileIfNotExists = exports.listFiles = exports.createFile = exports.fileExists = exports.isDirectory = void 0;
const fs = __webpack_require__(8);
const errors_1 = __webpack_require__(6);
const isDirectory = (path) => {
    return fs.lstatSync(path).isDirectory();
};
exports.isDirectory = isDirectory;
const fileExists = (filePath) => {
    return fs.existsSync(filePath);
};
exports.fileExists = fileExists;
const createFile = (filePath) => {
    if ((0, exports.fileExists)(filePath)) {
        throw new FileAlreadyExistsError(`${filePath} already exists`);
    }
    fs.appendFileSync(filePath, '', 'utf-8');
};
exports.createFile = createFile;
const listFiles = (dirPath) => {
    return fs.readdirSync(dirPath);
};
exports.listFiles = listFiles;
const createFileIfNotExists = (filePath) => {
    if ((0, exports.fileExists)(filePath)) {
        return;
    }
    (0, exports.createFile)(filePath);
};
exports.createFileIfNotExists = createFileIfNotExists;
const clearFile = (filePath) => {
    if ((0, exports.fileExists)(filePath)) {
        fs.writeFileSync(filePath, '');
    }
};
exports.clearFile = clearFile;
const getLines = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8').split('\n');
};
exports.getLines = getLines;
const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, data);
};
exports.writeFile = writeFile;
class FileAlreadyExistsError extends errors_1.ApplicationError {
}
exports.FileAlreadyExistsError = FileAlreadyExistsError;


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isGenerated = exports.isDart = exports.getExtension = void 0;
const getExtension = (filePath) => {
    const match = filePath.match(/.*\.(.+)/);
    if (!match) {
        return null;
    }
    return match[1];
};
exports.getExtension = getExtension;
const isDart = (filePath) => {
    return filePath.endsWith('.dart');
};
exports.isDart = isDart;
const isGenerated = (filePath) => {
    return filePath.endsWith('.g.dart') || filePath.endsWith('.freezed.dart');
};
exports.isGenerated = isGenerated;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const commands = __webpack_require__(2);
function activate(context) {
    const addCurrentFile = vscode.commands.registerCommand('extension.addCurrentFileToIndexDart', () => {
        commands.addCurrentFileToIndexDart();
    });
    const addCurrentFileDirName = vscode.commands.registerCommand('extension.addCurrentFileToIndexDartDirName', () => {
        commands.addCurrentFileToIndexDartDirName();
    });
    const exportAllFiles = vscode.commands.registerCommand('extension.exportDartFilesInCurrentDirectory', () => {
        commands.exportDartFilesInCurrentDirectory();
    });
    const exportAllFilesDirName = vscode.commands.registerCommand('extension.exportDartFilesInCurrentDirectoryDirName', () => {
        commands.exportDartFilesInCurrentDirectoryDirName();
    });
    const exportAllFilesBelow = vscode.commands.registerCommand('extension.exportDartFilesFromSubdirectoriesInCurrentDirectory', () => {
        commands.exportAllFilesBelowToIndexDart();
    });
    const exportAllFilesBelowDirName = vscode.commands.registerCommand('extension.exportDartFilesFromSubdirectoriesInCurrentDirectoryDirName', () => {
        commands.exportAllFilesBelowToDirNameDart();
    });
    context.subscriptions.push(addCurrentFile);
    context.subscriptions.push(addCurrentFileDirName);
    context.subscriptions.push(exportAllFiles);
    context.subscriptions.push(exportAllFilesDirName);
    context.subscriptions.push(exportAllFilesBelow);
    context.subscriptions.push(exportAllFilesBelowDirName);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map