"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
const uuid = () => {
    const timestamp = Date.now().toString(36);
    const random1 = Math.random().toString(36).substring(2, 8);
    const random2 = Math.random().toString(36).substring(2, 8);
    const random3 = Math.random().toString(36).substring(2, 8);
    return `${random1}-${timestamp}-${random2}-${random3}`;
};
exports.uuid = uuid;
