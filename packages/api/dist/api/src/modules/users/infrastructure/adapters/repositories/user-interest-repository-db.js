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
exports.UserInterestRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_1 = require("inversify");
const map_user_interest_model_to_entity_1 = require("../../mappers/map-user-interest-model-to-entity");
const uuid_1 = require("../../../../../../../shared/uuid");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let UserInterestRepositoryDb = class UserInterestRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async bulkCreate(userId, interests) {
        if (interests.length === 0)
            return;
        const values = [];
        const valuePlaceholders = interests
            .map((interest, i) => {
            const baseIndex = i * 3;
            const id = (0, uuid_1.uuid)();
            values.push(id, userId, interest);
            return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
        })
            .join(', ');
        const insertQuery = {
            text: `
      INSERT INTO user_interests (id, user_id, interest)
      VALUES ${valuePlaceholders}
      ON CONFLICT (user_id, interest) DO NOTHING;
    `,
            values,
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
        }
        catch (error) {
            const errorMessage = `Failed to insert user interests: ${error}`;
            this.logger.error(errorMessage);
        }
    }
    async findAllByColumn(column, value) {
        const queryUserInterest = {
            text: `SELECT * FROM user_interests WHERE ${column} = $1`,
            values: [value],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUserInterest);
        connexion.release();
        const userInterestRawList = result.rows;
        return userInterestRawList.map((userInterest) => (0, map_user_interest_model_to_entity_1.mapUserInterestModelToEntity)(userInterest));
    }
    async findAll() {
        const queryUserInterest = {
            text: `SELECT DISTINCT interest FROM user_interests ORDER BY interest`,
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUserInterest);
        connexion.release();
        const userInterestRawList = result.rows;
        return userInterestRawList.map((userInterest) => userInterest.interest);
    }
    async deleteByUserId(userId) {
        const deleteQuery = {
            text: `DELETE FROM user_interests WHERE user_id = $1`,
            values: [userId],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(deleteQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to delete user interest with id ${userId}: ${error}`);
        }
    }
};
exports.UserInterestRepositoryDb = UserInterestRepositoryDb;
exports.UserInterestRepositoryDb = UserInterestRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], UserInterestRepositoryDb);
