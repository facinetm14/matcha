"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEventBus = void 0;
const node_stream_1 = require("node:stream");
const inversify_1 = require("inversify");
let NodeEventBus = class NodeEventBus extends node_stream_1.EventEmitter {
    publish(event, payload) {
        this.emit(event, payload);
    }
    subscribe(event, handler) {
        this.on(event, handler);
    }
};
exports.NodeEventBus = NodeEventBus;
exports.NodeEventBus = NodeEventBus = __decorate([
    (0, inversify_1.injectable)()
], NodeEventBus);
