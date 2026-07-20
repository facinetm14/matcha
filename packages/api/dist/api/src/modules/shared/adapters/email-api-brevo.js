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
exports.EmailApiBrevo = void 0;
const inversify_1 = require("inversify");
const brevo_1 = require("@getbrevo/brevo");
const inversify_type_1 = require("../../../config/ioc/inversify-type");
const emailApiBrevo = new brevo_1.TransactionalEmailsApi();
emailApiBrevo.setApiKey(brevo_1.TransactionalEmailsApiApiKeys.apiKey, `${process.env.MAIL_API_KEY}`);
let EmailApiBrevo = class EmailApiBrevo {
    constructor(logger) {
        this.logger = logger;
    }
    async send(payload) {
        const message = new brevo_1.SendSmtpEmail();
        message.subject = payload.subject;
        message.htmlContent = payload.message;
        message.sender = {
            name: `${process.env.APP_NAME}`,
            email: `${process.env.FROM}`,
        };
        message.to = [{ email: payload.email, name: payload.username }];
        emailApiBrevo.sendTransacEmail(message).then(() => {
            this.logger.success(`mail successfully sent to ${payload.email}`);
        }, (error) => {
            console.error(error);
            this.logger.error(`Failed to send mail to ${payload.email}`);
        });
    }
};
exports.EmailApiBrevo = EmailApiBrevo;
exports.EmailApiBrevo = EmailApiBrevo = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], EmailApiBrevo);
