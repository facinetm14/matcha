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
exports.UserImageRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const uuid_1 = require("../../../../../../../shared/uuid");
const inversify_1 = require("inversify");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
let UserImageRepositoryDb = class UserImageRepositoryDb {
    constructor(logger) {
        this.logger = logger;
    }
    async bulkCreate(userId, imageList) {
        const values = [];
        const valuePlaceholders = imageList
            .map((img, i) => {
            const baseIndex = i * 4;
            const id = (0, uuid_1.uuid)();
            values.push(id, userId, img.position, img.preview);
            return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`;
        })
            .join(', ');
        const insertQuery = {
            text: `
          INSERT INTO user_images (id, user_id, position, preview)
          VALUES ${valuePlaceholders};
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
    async delete(userId, previewList) {
        const deleteQuery = {
            text: `DELETE FROM  user_images WHERE user_id = $1 AND preview = ANY($2)`,
            values: [userId, previewList],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(deleteQuery);
            connexion.release();
        }
        catch (error) {
            this.logger.error(`Failed to delete user token with userId ${userId} and position ${previewList}: ${error}`);
        }
    }
    async reorderImages(userId, imageList) {
        const values = [];
        const casesPosition = [];
        let argIndex = 1;
        imageList.forEach((img) => {
            values.push(img.preview);
            values.push(img.position);
            casesPosition.push(`WHEN preview = $${argIndex} THEN $${argIndex + 1}`);
            argIndex += 2;
        });
        values.push(userId);
        const query = {
            text: `
      UPDATE user_images
      SET position = CASE
        ${casesPosition.join('\n')}
         ELSE position
      END
      WHERE user_id = $${argIndex}
    `,
            values,
        };
        try {
            const connection = await data_source_1.pgClient.connect();
            await connection.query(query);
            connection.release();
        }
        catch (error) {
            const errorMessage = `Failed to update user image positions: ${error}`;
            this.logger.error(errorMessage);
        }
    }
};
exports.UserImageRepositoryDb = UserImageRepositoryDb;
exports.UserImageRepositoryDb = UserImageRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __metadata("design:paramtypes", [Object])
], UserImageRepositoryDb);
