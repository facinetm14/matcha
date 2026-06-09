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
exports.FetchBestUserSuggestion = void 0;
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const distance_1 = require("../../../../../../shared/distance");
let FetchBestUserSuggestion = class FetchBestUserSuggestion {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const connectedUser = await this.userRepository.findUserProfileById(userId);
        if (!connectedUser) {
            return [];
        }
        const userList = await this.userRepository.findAllUsers(userId);
        const distanceFromConnectedUser = new Map();
        const sharedTagsWithConnectedUser = new Map();
        const suggestedUsers = [];
        const sexPref = connectedUser?.sexualOrientation ?? [];
        for (const user of userList) {
            let matched = false;
            if ([
                ...connectedUser.blocked,
                ...connectedUser.swiped,
                ...connectedUser.matched,
            ].includes(user.id)) {
                continue;
            }
            if ([...user.blocked, ...user.swiped, ...user.likedBy].includes(connectedUser.id)) {
                continue;
            }
            if (sexPref.length &&
                user.gender &&
                !sexPref.includes(user.gender)) {
                continue;
            }
            const distance = (0, distance_1.calculateDistanceKm)(connectedUser.location, user.location);
            if (distance < distance_1.MAX_SUGGESTED_DISTANCE_KM) {
                distanceFromConnectedUser.set(user.id, distance);
                matched = true;
            }
            const combinedTags = [...user.tags, ...connectedUser.tags];
            const sharedTag = combinedTags.length - new Set([...combinedTags]).size;
            if (sharedTag) {
                if (!matched) {
                    matched = true;
                }
                sharedTagsWithConnectedUser.set(user.id, sharedTag);
            }
            suggestedUsers.push(user);
        }
        return suggestedUsers.sort((a, b) => this.smartSort({
            distance: distanceFromConnectedUser.get(a.id),
            sharedTags: sharedTagsWithConnectedUser.get(a.id),
            fameRating: a.fameRating,
        }, {
            distance: distanceFromConnectedUser.get(b.id),
            sharedTags: sharedTagsWithConnectedUser.get(b.id),
            fameRating: b.fameRating,
        }));
    }
    smartSort(user1, user2) {
        if (user1.distance !== user2.distance) {
            return user1.distance - user2.distance;
        }
        if (user1.sharedTags !== user2.sharedTags) {
            return user1.sharedTags - user2.sharedTags;
        }
        return user1.fameRating - user2.fameRating;
    }
};
exports.FetchBestUserSuggestion = FetchBestUserSuggestion;
exports.FetchBestUserSuggestion = FetchBestUserSuggestion = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserRepository)),
    __metadata("design:paramtypes", [Object])
], FetchBestUserSuggestion);
