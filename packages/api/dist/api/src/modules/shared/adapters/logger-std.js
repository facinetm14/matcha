"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerStd = void 0;
const inversify_1 = require("inversify");
let LoggerStd = class LoggerStd {
    info(message) {
        console.log(`\x1b[34m[INFO]\x1b[0m ${message}`);
    }
    error(message) {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
    }
    success(message) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`);
    }
};
exports.LoggerStd = LoggerStd;
exports.LoggerStd = LoggerStd = __decorate([
    (0, inversify_1.injectable)()
], LoggerStd);
