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
exports.UserRepositoryDb = void 0;
const user_uniq_keys_enum_1 = require("../../../application/consts/user-uniq-keys.enum");
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_1 = require("inversify");
const user_model_to_entity_1 = require("../../mappers/user-model-to-entity");
const map_entity_or_dto_to_model_1 = require("../../../../shared/utils/map-entity-or-dto-to-model");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const cache_ressource_keys_1 = require("../../../../../modules/shared/consts/cache-ressource-keys");
let UserRepositoryDb = class UserRepositoryDb {
    constructor(logger, cacheService) {
        this.logger = logger;
        this.cacheService = cacheService;
    }
    async create(createUserDto) {
        const userModel = (0, map_entity_or_dto_to_model_1.mapEnityOrDtoToModel)(createUserDto);
        const { id, username, first_name, last_name, email, passwd, created_at, updated_at, status, } = userModel;
        const insertQuery = {
            text: `
        INSERT INTO users(id, username, email, passwd, created_at, updated_at, status, first_name, last_name)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
            values: [
                id,
                username,
                email,
                passwd,
                created_at,
                updated_at,
                status,
                first_name,
                last_name,
            ],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
            return id;
        }
        catch (error) {
            const errorMessage = `Failed to register user: ${error}`;
            this.logger.error(errorMessage);
            return null;
        }
    }
    async findUserByUniqKey(key, value) {
        const queryUser = {
            text: `SELECT * FROM users WHERE ${key} = $1 LIMIT 1`,
            values: [value],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUser);
        connexion.release();
        const user = result.rows[0];
        if (!user) {
            return null;
        }
        return (0, user_model_to_entity_1.mapUserModelToEntity)(user);
    }
    async update(id, updateUserDto) {
        const updateUser = (0, map_entity_or_dto_to_model_1.mapEnityOrDtoToModel)(updateUserDto);
        let columns = '';
        const columnsValues = [];
        let index = 1;
        for (const [colum, value] of Object.entries(updateUser)) {
            columns += `${index > 1 ? ',' : ''} ${colum}=$${index}`;
            columnsValues.push(value);
            index += 1;
        }
        const updateQuery = {
            text: `UPDATE users SET ${columns} WHERE id=$${index}`,
            values: [...columnsValues, id],
        };
        const connexion = await data_source_1.pgClient.connect();
        try {
            const rowAffected = await data_source_1.pgClient.query(updateQuery);
            if (!rowAffected) {
                this.logger.error(`Error: unable to update user ${id}, ${rowAffected}`);
            }
        }
        catch (error) {
            this.logger.error(`Error: unable to update user ${id}, ${error}`);
        }
        connexion.release();
        return this.findUserByUniqKey(user_uniq_keys_enum_1.UserUniqKeys.ID, id);
    }
    async findUserProfileById(id) {
        const queryUser = {
            text: `
              SELECT u.*, 
              uim.id as img_id, uim.position as img_position, uim.preview as img_preview,
              ui.interest, ui.id as tag_id,
              upi.author, upi.category, upi.created_at as interaction_created_at, upi.recipient as interaction_recipient, upi.id as interaction_id,
              notif.id as notif_id, notif.author as notif_author, notif.from_user as notif_from_user,
              notif.created_at as notif_created_at, notif.updated_at as notif_updated_at, notif.is_read as notif_is_read,
              notif.category as notif_category,
              uloc.id as location_id, uloc.city as location_city, uloc.shared_by_user_at as location_shared_by_user_at, uloc.lat as location_lat, uloc.lng as location_lng
              FROM users as u
              LEFT JOIN user_images as uim ON u.id = uim.user_id
              LEFT JOIN user_interests as ui ON u.id = ui.user_id
              LEFT JOIN users_location as uloc ON u.id = uloc.user_id
              LEFT JOIN user_profile_interactions as upi ON (
                (upi.author = u.id AND upi.category = ANY($3))
                  OR
                (upi.recipient = u.id)
              )
              LEFT JOIN user_notifications as notif ON (
                (notif.author = u.id AND notif.category != $2)
                 OR 
                (notif.category = $2 AND (notif.author = u.id OR notif.from_user = u.id))
              )
              WHERE u.id = $1
              ORDER BY interaction_created_at DESC
            `,
            values: [id, 'match', ['swipe', 'block']],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUser);
        connexion.release();
        const userProfileRawList = result.rows;
        if (!userProfileRawList.length) {
            return null;
        }
        const userProfileRawListWithOnlineStatus = [];
        for (const user of userProfileRawList) {
            const isOnline = await this.getOnlineStatus(user.id);
            const lastSeen = await this.getLastConnection(user.id);
            userProfileRawListWithOnlineStatus.push({ ...user, isOnline, lastSeen });
        }
        const userProfiles = await (0, user_model_to_entity_1.buildUserProfileFromUserAggregate)(userProfileRawListWithOnlineStatus);
        return userProfiles[0];
    }
    async findUserProfileByIdList(idList) {
        const queryUser = {
            text: `
              SELECT u.*, 
              uim.id as img_id, uim.position as img_position, uim.preview as img_preview,
              ui.interest, ui.id as tag_id,
              upi.author, upi.category, upi.created_at as interaction_created_at, upi.recipient as interaction_recipient, upi.id as interaction_id,
              notif.id as notif_id, notif.author as notif_author, notif.from_user as notif_from_user,
              notif.created_at as notif_created_at, notif.updated_at as notif_updated_at, notif.is_read as notif_is_read,
              notif.category as notif_category,
              uloc.id as location_id, uloc.city as location_city, uloc.shared_by_user_at as location_shared_by_user_at, uloc.lat as location_lat, uloc.lng as location_lng
              FROM users as u
              LEFT JOIN user_images as uim ON u.id = uim.user_id
              LEFT JOIN user_interests as ui ON u.id = ui.user_id
              LEFT JOIN users_location as uloc ON u.id = uloc.user_id
              LEFT JOIN user_profile_interactions as upi ON (
                (upi.author = u.id AND upi.category = ANY($3))
                  OR
                (upi.recipient = u.id)
              )
              LEFT JOIN user_notifications as notif ON (
                (notif.author = u.id AND notif.category != $2)
                 OR 
                (notif.category = $2 AND (notif.author = u.id OR notif.from_user = u.id))
              )
              WHERE u.id = ANY($1)
              ORDER BY interaction_created_at DESC
            `,
            values: [idList, 'match', ['swipe', 'block']],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUser);
        connexion.release();
        const userProfileRawList = result.rows;
        if (!userProfileRawList.length) {
            return [];
        }
        const userProfileRawListWithOnlineStatus = [];
        for (const user of userProfileRawList) {
            const isOnline = await this.getOnlineStatus(user.id);
            const lastSeen = await this.getLastConnection(user.id);
            userProfileRawListWithOnlineStatus.push({ ...user, isOnline, lastSeen });
        }
        const userProfiles = await (0, user_model_to_entity_1.buildUserProfileFromUserAggregate)(userProfileRawListWithOnlineStatus);
        return userProfiles;
    }
    async getOnlineStatus(userId) {
        const isConnectedUser = await this.cacheService.findById(cache_ressource_keys_1.CacheResourceKeys.CONNECTED_USERS, userId);
        return !!isConnectedUser;
    }
    async getLastConnection(userId) {
        const lastConnection = await this.cacheService.findById(cache_ressource_keys_1.CacheResourceKeys.LAST_CONNEXION, userId);
        if (!lastConnection) {
            return null;
        }
        return lastConnection.lastSeen;
    }
    /**
     *
     * @param filter {age: Range<number>, fameRating, tags}
     * @returns users list UserProfile[]
     */
    async findUsersByFilter(filter, userId) {
        const values = [];
        let clauseWhere = ' WHERE id != $1';
        values.push(userId);
        let valuesIndex = 2;
        if (filter.age?.from) {
            const now = new Date();
            const startDate = new Date(`${now.getFullYear() - filter.age.from}-01-01`);
            clauseWhere += ` AND (birth_date <= $${valuesIndex})`;
            values.push(startDate);
            valuesIndex += 1;
        }
        if (filter.age?.to) {
            const now = new Date();
            const endDate = new Date(`${now.getFullYear() - filter.age.to}-12-31`);
            clauseWhere += ` AND (birth_date >= $${valuesIndex})`;
            values.push(endDate);
            valuesIndex += 1;
        }
        const queryIdUsers = {
            text: `SELECT id FROM users ${clauseWhere}`,
            values,
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryIdUsers);
        connexion.release();
        if (!result.rows.length) {
            return [];
        }
        const user = await this.findUserProfileById(userId);
        if (!user) {
            return [];
        }
        const idList = result.rows
            .map((u) => u.id)
            .filter((u) => !user.blocked.includes(u));
        return await this.findUserProfileByIdList(idList);
    }
    async findAllUsers(userId) {
        const queryUser = {
            text: `
              SELECT u.*, 
              uim.id as img_id, uim.position as img_position, uim.preview as img_preview,
              ui.interest, ui.id as tag_id,
              upi.author, upi.category, upi.created_at as interaction_created_at, upi.recipient as interaction_recipient, upi.id as interaction_id,
              notif.id as notif_id, notif.author as notif_author, notif.from_user as notif_from_user,
              notif.created_at as notif_created_at, notif.updated_at as notif_updated_at, notif.is_read as notif_is_read,
              notif.category as notif_category,
              uloc.id as location_id, uloc.city as location_city, uloc.shared_by_user_at as location_shared_by_user_at, uloc.lat as location_lat, uloc.lng as location_lng
              FROM users as u
              LEFT JOIN user_images as uim ON u.id = uim.user_id
              LEFT JOIN user_interests as ui ON u.id = ui.user_id
              LEFT JOIN users_location as uloc ON u.id = uloc.user_id
              LEFT JOIN user_profile_interactions as upi ON (
                (upi.author = u.id AND upi.category = ANY($2))
                  OR
                (upi.recipient = u.id)
              )
              LEFT JOIN user_notifications as notif ON (
                (notif.author = u.id AND notif.category != $1)
                 OR 
                (notif.category = $1 AND (notif.author = u.id OR notif.from_user = u.id))
              )
              WHERE u.id != $3
              ORDER BY interaction_created_at DESC
            `,
            values: ['match', ['block', 'swipe'], userId],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUser);
        connexion.release();
        const userProfileRawList = result.rows;
        if (!userProfileRawList.length) {
            return [];
        }
        const userProfileRawListWithOnlineStatus = [];
        for (const user of userProfileRawList) {
            const isOnline = await this.getOnlineStatus(user.id);
            const lastSeen = await this.getLastConnection(user.id);
            userProfileRawListWithOnlineStatus.push({ ...user, isOnline, lastSeen });
        }
        const userProfiles = await (0, user_model_to_entity_1.buildUserProfileFromUserAggregate)(userProfileRawListWithOnlineStatus);
        return userProfiles;
    }
};
exports.UserRepositoryDb = UserRepositoryDb;
exports.UserRepositoryDb = UserRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.CacheService)),
    __metadata("design:paramtypes", [Object, Object])
], UserRepositoryDb);
