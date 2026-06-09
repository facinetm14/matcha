"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpperCase = isUpperCase;
exports.mapEnityOrDtoToModel = mapEnityOrDtoToModel;
function isUpperCase(char) {
    return char === char.toUpperCase() && char !== char.toLowerCase();
}
function mapEnityOrDtoToModel(entity) {
    const model = {};
    for (const [key, value] of Object.entries(entity)) {
        const potentialModelKey = [...key]
            .map((char) => (isUpperCase(char) ? `_${char.toLowerCase()}` : char))
            .join('');
        model[potentialModelKey] = value;
    }
    return model;
}
