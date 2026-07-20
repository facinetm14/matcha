"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenRepositoryInMemory = void 0;
const factory_1 = require("../../../../shared/utils/factory");
class UserTokenRepositoryInMemory {
    constructor() {
        this.usersTokens = [];
    }
    async create(createUserToken) {
        this.usersTokens.push((0, factory_1.factoryUserToken)({ ...createUserToken }));
        return createUserToken.id;
    }
    async findById(id) {
        return this.usersTokens.find((userToken) => userToken.id === id) ?? null;
    }
    async delete(id) {
        const currentUsersToken = structuredClone(this.usersTokens);
        this.usersTokens = currentUsersToken.filter((userToken) => userToken.id !== id);
    }
}
exports.UserTokenRepositoryInMemory = UserTokenRepositoryInMemory;
