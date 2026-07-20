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
exports.UserInteractionRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const uuid_1 = require("../../../../../../../shared/uuid");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let UserInteractionRepositoryDb = class UserInteractionRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async create(createInteractionDto, author) {
        const now = new Date();
        const newInteraction = {
            id: (0, uuid_1.uuid)(),
            author,
            recipient: createInteractionDto.recipient,
            category: createInteractionDto.category,
            created_at: now,
            updated_at: now,
        };
        const { id, recipient, category, created_at, updated_at } = newInteraction;
        const insertQuery = {
            text: `
        INSERT INTO user_profile_interactions(id, author, recipient, category, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6)
      `,
            values: [id, author, recipient, category, created_at, updated_at],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
            return id;
        }
        catch (error) {
            const errorMessage = `Failed to insert user interaction ${newInteraction}: ${error}`;
            this.logger.error(errorMessage);
            return null;
        }
    }
    async delete(createInteractionDto, author) {
        const deleteQuery = {
            text: `DELETE FROM user_profile_interactions WHERE author = $1 AND recipient = $2 AND category = $3`,
            values: [
                author,
                createInteractionDto.recipient,
                createInteractionDto.category,
            ],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(deleteQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to delete user ${author} interaction with id ${createInteractionDto.recipient} and category ${createInteractionDto.category}: ${error}`);
        }
    }
    async findInteraction(interaction) {
        const query = {
            text: `SELECT * FROM user_profile_interactions WHERE author = $1 AND recipient = $2 AND category = $3 ORDER BY created_at DESC LIMIT 1`,
            values: [interaction.author, interaction.recipient, interaction.category],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(query);
        connexion.release();
        const interactionModel = result.rows[0];
        if (!interactionModel) {
            return null;
        }
        return {
            id: interactionModel.id,
            author: interactionModel.author,
            recipient: interactionModel.recipient,
            category: interactionModel.category,
            createdAt: interactionModel.created_at,
            updatedAt: interactionModel.updated_at,
        };
    }
};
exports.UserInteractionRepositoryDb = UserInteractionRepositoryDb;
exports.UserInteractionRepositoryDb = UserInteractionRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], UserInteractionRepositoryDb);
