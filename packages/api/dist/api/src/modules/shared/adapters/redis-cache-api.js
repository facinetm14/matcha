"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheApi = void 0;
const redis_1 = require("redis");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../config/ioc/inversify-type");
let RedisCacheApi = class RedisCacheApi {
    constructor(logger) {
        this.logger = logger;
        this.client = (0, redis_1.createClient)({
            url: 'redis://redis:6379',
        });
        this.client.once('error', (error) => this.logger.error(`Failed to create redis client ${error}`));
    }
    async insert(resourceKey, data) {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            await this.client.hSet(resourceKey, data.id, JSON.stringify(data));
            return data.id;
        }
        catch (error) {
            this.logger.error(`Failed to insert access token in redis ${error}`);
            return null;
        }
    }
    async findById(resourceKey, id) {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        const token = await this.client.hGet(resourceKey, id);
        if (!token)
            return null;
        return JSON.parse(token);
    }
    async delete(resourceKey, id) {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        await this.client.hDel(resourceKey, id);
    }
};
exports.RedisCacheApi = RedisCacheApi;
exports.RedisCacheApi = RedisCacheApi = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], RedisCacheApi);
