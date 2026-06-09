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
exports.NotificationManager = void 0;
const inversify_1 = require("inversify");
const email_subject_1 = require("../../../modules/shared/consts/email-subject");
const inversify_type_1 = require("../../../config/ioc/inversify-type");
const user_mail_template_1 = require("../utils/user.mail-template");
const clientHost = `${process.env.CLIENT_HOST}`;
let NotificationManager = class NotificationManager {
    constructor(emailService, userNotificationRepository) {
        this.emailService = emailService;
        this.userNotificationRepository = userNotificationRepository;
    }
    async createUserRegisteredNotifification(payload) {
        const verifyLink = `${clientHost}/verify/${payload.userToken.id}`;
        const emailPayload = {
            email: payload.email,
            message: (0, user_mail_template_1.buildUserRegisteredEmailTemplate)(payload.username, verifyLink),
            subject: email_subject_1.EmailSubject.USER_REGISTRATION,
            username: payload.username,
        };
        this.emailService.send(emailPayload);
    }
    async createResetPasswordNotification(payload) {
        const verifyLink = `${clientHost}/new-password/${payload.userToken.id}`;
        const emailPayload = {
            email: payload.email,
            message: (0, user_mail_template_1.buildResetPasswordEmailTemplate)(payload.username, verifyLink),
            subject: email_subject_1.EmailSubject.REST_PASSWORD,
            username: payload.username,
        };
        this.emailService.send(emailPayload);
    }
    async createAppNotification(notification) {
        return this.userNotificationRepository.create(notification);
    }
    async deleteMatch(author, fromUser) {
        return this.userNotificationRepository.deleteMatch(author, fromUser);
    }
};
exports.NotificationManager = NotificationManager;
exports.NotificationManager = NotificationManager = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.EmailService)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.UserNotificationRepository)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationManager);
