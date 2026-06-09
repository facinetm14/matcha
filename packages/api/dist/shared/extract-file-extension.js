"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFileExtension = void 0;
const extractFileExtension = (path) => {
    return path.substring(path.lastIndexOf(".") + 1);
};
exports.extractFileExtension = extractFileExtension;
