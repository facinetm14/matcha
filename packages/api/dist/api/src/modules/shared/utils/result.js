"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ok = Ok;
exports.Err = Err;
function Ok(data) {
    return {
        isErr: false,
        data,
    };
}
function Err(error) {
    return {
        isErr: true,
        error,
    };
}
