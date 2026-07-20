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
exports.UserTokenRepositoryDb = void 0;
const inversify_1 = require("inversify");
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const user_token_model_to_entity_1 = require("../../mappers/user-token-model-to-entity");
const map_entity_or_dto_to_model_1 = require("../../../../shared/utils/map-entity-or-dto-to-model");
let UserTokenRepositoryDb = class UserTokenRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async create(createUserToken) {
        const userToken = (0, map_entity_or_dto_to_model_1.mapEnityOrDtoToModel)(createUserToken);
        const { id, user_id, category, token, created_at, updated_at, ip_addr, device, expire_at, } = userToken;
        const insertQuery = {
            text: `
        INSERT INTO users_tokens(id, user_id, category, token, created_at, updated_at, ip_addr, device, expire_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
            values: [
                id,
                user_id,
                category,
                token,
                created_at,
                updated_at,
                ip_addr,
                device,
                expire_at,
            ],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
            return id;
        }
        catch (error) {
            const errorMessage = `Failed to insert user token ${userToken}: ${error}`;
            this.logger.error(errorMessage);
            return null;
        }
    }
    async findById(id) {
        const queryUserToken = {
            text: `SELECT * FROM users_tokens WHERE id = $1 LIMIT 1`,
            values: [id],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUserToken);
        connexion.release();
        const userToken = result.rows[0];
        if (!userToken) {
            return null;
        }
        return (0, user_token_model_to_entity_1.mapUserTokenModelToEntity)(userToken);
    }
    async delete(id) {
        const queryUserToken = {
            text: `DELETE FROM users_tokens WHERE id = $1`,
            values: [id],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(queryUserToken);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to delete user token with id ${id}: ${error}`);
        }
    }
};
exports.UserTokenRepositoryDb = UserTokenRepositoryDb;
exports.UserTokenRepositoryDb = UserTokenRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], UserTokenRepositoryDb);
