"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryInMemory = void 0;
const factory_1 = require("../../../../../modules/shared/utils/factory");
const password_1 = require("../../../../auth/infrastructure/utils/password");
class UserRepositoryInMemory {
    constructor() {
        this.users = [];
    }
    async findAllUsers(userId) {
        return [];
    }
    findUserProfileByIdList(_userId) {
        return Promise.resolve([]);
    }
    async create(createUserDto) {
        this.users.push((0, factory_1.factoryUser)({ ...createUserDto }));
        return Promise.resolve(createUserDto.id);
    }
    async update(id, updateUserDto) {
        const userToUpdate = this.users.find((u) => u.id === id);
        if (!userToUpdate) {
            return null;
        }
        const updatedUser = structuredClone({ ...userToUpdate, ...updateUserDto });
        const currentUsers = structuredClone(this.users);
        this.users = currentUsers.map((user) => {
            if (user.id === id) {
                return updatedUser;
            }
            return user;
        });
        const passwd = await (0, password_1.hashPassword)(updatedUser.passwd);
        return Promise.resolve({ ...updatedUser, passwd });
    }
    async findUserByUniqKey(key, value) {
        const user = this.users.find((user) => {
            for (const [k, v] of Object.entries(user)) {
                if (key === k && v === value) {
                    return true;
                }
            }
            return false;
        });
        if (user) {
            const passwd = await (0, password_1.hashPassword)(user?.passwd ?? '');
            return { ...user, passwd };
        }
        return null;
    }
    async findUserProfileById(userId) {
        const user = this.users.find((user) => user.id === userId);
        if (!user) {
            return null;
        }
        return Promise.resolve({
            ...user,
            tags: [],
            photos: [],
            fameRating: 0,
            isOnline: false,
            reported: false,
            lastSeen: null,
            likedBy: [],
            blocked: [],
            viewedBy: [],
            notifications: [],
            matched: [],
            swiped: [],
            sexualOrientation: [],
        });
    }
    async findUsersByFilter(_filter, _userId) {
        return [];
    }
}
exports.UserRepositoryInMemory = UserRepositoryInMemory;
