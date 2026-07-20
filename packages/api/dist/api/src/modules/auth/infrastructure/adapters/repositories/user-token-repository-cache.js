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
exports.UserTokenRepositoryInCache = void 0;
const inversify_1 = require("inversify");
const cache_ressource_keys_1 = require("../../../../../modules/shared/consts/cache-ressource-keys");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let UserTokenRepositoryInCache = class UserTokenRepositoryInCache {
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    create(createUserToken) {
        return this.cacheService.insert(cache_ressource_keys_1.CacheResourceKeys.USER_TOKENS, createUserToken);
    }
    findById(id) {
        return this.cacheService.findById(cache_ressource_keys_1.CacheResourceKeys.USER_TOKENS, id);
    }
    delete(id) {
        return this.cacheService.delete(cache_ressource_keys_1.CacheResourceKeys.USER_TOKENS, id);
    }
};
exports.UserTokenRepositoryInCache = UserTokenRepositoryInCache;
exports.UserTokenRepositoryInCache = UserTokenRepositoryInCache = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.CacheService)),
    __metadata("design:paramtypes", [Object])
], UserTokenRepositoryInCache);
