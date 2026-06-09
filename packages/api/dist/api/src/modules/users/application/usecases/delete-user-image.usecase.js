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
exports.DeleteUserImageUsceCase = void 0;
const event_type_1 = require("../../../../modules/shared/consts/event-type");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
let DeleteUserImageUsceCase = class DeleteUserImageUsceCase {
    constructor(userImageRepository, eventBus) {
        this.userImageRepository = userImageRepository;
        this.eventBus = eventBus;
    }
    async execute(userId, previewList) {
        this.eventBus.publish(event_type_1.EventType.USER_IMAGE_DELETED, JSON.stringify({ userId, images: previewList }));
        return this.userImageRepository.delete(userId, previewList);
    }
};
exports.DeleteUserImageUsceCase = DeleteUserImageUsceCase;
exports.DeleteUserImageUsceCase = DeleteUserImageUsceCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.UserImageRepository)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.EventBus)),
    __metadata("design:paramtypes", [Object, Object])
], DeleteUserImageUsceCase);
