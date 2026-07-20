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
exports.UserNotificationRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let UserNotificationRepositoryDb = class UserNotificationRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async create(createAppNotification) {
        const { id, author, fromUser, isRead, createdAt, updatedAt, category } = createAppNotification;
        const insertQuery = {
            text: `
            INSERT INTO user_notifications(id, author, from_user, is_read, created_at, updated_at, category)
            VALUES($1, $2, $3, $4, $5, $6, $7)
          `,
            values: [
                id,
                author,
                fromUser,
                isRead ? 'yes' : null,
                createdAt,
                updatedAt,
                category,
            ],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
        }
        catch (error) {
            const errorMessage = `Failed to insert user interaction ${createAppNotification}: ${error}`;
            this.logger.error(errorMessage);
        }
    }
    async findMatchByUserId(userId) {
        const query = {
            text: `
            SELECT * FROM user_notifications WHERE category = 'match' AND (
              author = $1
              OR
              from_user = $1
            )
          `,
            values: [userId],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            const matchResp = await data_source_1.pgClient.query(query);
            connexion.release();
            return matchResp.rows.map((m) => {
                const match = {
                    id: m.id,
                    author: m.author,
                    fromUser: m.from_user,
                    createdAt: m.created_at,
                    updatedAt: m.updated_at,
                    category: m.category,
                    isRead: m.is_read ? true : false,
                };
                return match;
            });
        }
        catch (error) {
            const errorMessage = `Failed while fetch user match ${userId}: ${error}`;
            this.logger.error(errorMessage);
            return [];
        }
    }
    async findMatchById(id) {
        const query = {
            text: `
            SELECT * FROM user_notifications WHERE category = 'match' AND id = $1
          `,
            values: [id],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            const matchResp = await data_source_1.pgClient.query(query);
            connexion.release();
            const matchRaw = matchResp.rows[0];
            if (!matchRaw) {
                return null;
            }
            return {
                id: matchRaw.id,
                author: matchRaw.author,
                fromUser: matchRaw.from_user,
                createdAt: matchRaw.created_at,
                updatedAt: matchRaw.updated_at,
                category: matchRaw.category,
                isRead: matchRaw.is_read ? true : false,
            };
        }
        catch (error) {
            const errorMessage = `Failed while fetch user match ${id}: ${error}`;
            this.logger.error(errorMessage);
            return null;
        }
    }
    async deleteMatch(author, fromUser) {
        const deleteQuery = {
            text: `DELETE FROM user_notifications WHERE category = $2 AND 
      author = ANY($1) AND from_user = ANY($1)`,
            values: [[author, fromUser], 'match'],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(deleteQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to delete ${[author, fromUser]} match ${error}`);
        }
    }
    async updateReadStatusById(id) {
        const updateQuery = {
            text: `UPDATE user_notifications SET is_read = $1 WHERE id=$2`,
            values: ['yes', id],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(updateQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to update notification ${id} read status ${error}`);
        }
    }
    async updateReadStatusByAuthorAndFromUser(author, fromUser) {
        const updateQuery = {
            text: `UPDATE user_notifications SET is_read = $1 WHERE category = $2 AND 
      (
        author = $3
        AND
        from_user = $4
      ) `,
            values: ['yes', 'message', author, fromUser],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(updateQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to update notification ${{ author, fromUser }} read status ${error}`);
        }
    }
};
exports.UserNotificationRepositoryDb = UserNotificationRepositoryDb;
exports.UserNotificationRepositoryDb = UserNotificationRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], UserNotificationRepositoryDb);
