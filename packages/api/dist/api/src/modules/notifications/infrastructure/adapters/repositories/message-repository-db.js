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
exports.MessageRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let MessageRepositoryDb = class MessageRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async create(message) {
        const { id, senderId, channelId, isRead, createdAt, content, updatedAt } = message;
        const insertQuery = {
            text: `
                INSERT INTO messages(id, channel_id, sender_id, is_read, content, created_at, updated_at)
                VALUES($1, $2, $3, $4, $5, $6, $7)
              `,
            values: [
                id,
                channelId,
                senderId,
                isRead ? 'yes' : null,
                content,
                createdAt,
                updatedAt,
            ],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
        }
        catch (error) {
            const errorMessage = `Failed to insert message ${message}: ${error}`;
            this.logger.error(errorMessage);
        }
    }
    async findByChannelIdList(channeIdList) {
        const query = {
            text: `SELECT * FROM messages WHERE channel_id = ANY($1)`,
            values: [channeIdList],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            const messageResp = await data_source_1.pgClient.query(query);
            connexion.release();
            return messageResp.rows.map((m) => {
                const message = {
                    id: m.id,
                    channelId: m.channel_id,
                    content: m.content,
                    createdAt: m.created_at,
                    updatedAt: m.updated_at,
                    isRead: m.is_read ? true : false,
                    senderId: m.sender_id,
                };
                return message;
            });
        }
        catch (error) {
            const errorMessage = `Failed while fetching message from channel ${channeIdList}: ${error}`;
            this.logger.error(errorMessage);
            return [];
        }
    }
};
exports.MessageRepositoryDb = MessageRepositoryDb;
exports.MessageRepositoryDb = MessageRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], MessageRepositoryDb);
