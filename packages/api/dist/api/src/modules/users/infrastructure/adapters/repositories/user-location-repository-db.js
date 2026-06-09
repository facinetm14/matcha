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
exports.UserLocationRepositoryDb = void 0;
const data_source_1 = require("../../../../../config/db/data-source");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const extract_city_from_geocode_1 = require("../../../../../../../shared/extract-city-from-geocode");
const inversify_1 = require("inversify");
let UserLocationRepositoryDb = class UserLocationRepositoryDb {
    constructor(logger, geocodeService) {
        this.logger = logger;
        this.geocodeService = geocodeService;
    }
    async create(createUserLocation) {
        const { id, userId, isEnabledByUser, lat, lng } = createUserLocation;
        const now = new Date();
        const geocodeData = await this.geocodeService.getGeocode(lat, lng);
        const city = geocodeData
            ? (0, extract_city_from_geocode_1.extractCityFromGeocode)(geocodeData.address)
            : undefined;
        const insertQuery = {
            text: `
                INSERT INTO users_location(id, user_id, shared_by_user_at, lat, lng, city)
                VALUES($1, $2, $3, $4, $5, $6)
              `,
            values: [id, userId, isEnabledByUser ? now : null, lat, lng, city],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
        }
        catch (error) {
            const errorMessage = `Failed to insert user location ${createUserLocation}: ${error}`;
            this.logger.error(errorMessage);
        }
    }
    async update(userId, userLocation) {
        const { isEnabledByUser, lat, lng } = userLocation;
        const now = new Date();
        const geocodeData = await this.geocodeService.getGeocode(lat, lng);
        const city = geocodeData
            ? (0, extract_city_from_geocode_1.extractCityFromGeocode)(geocodeData.address)
            : undefined;
        const insertQuery = {
            text: `UPDATE users_location
              SET shared_by_user_at=$1, lat=$2, lng=$3, city=$4
            WHERE user_id=$5`,
            values: [isEnabledByUser ? now : null, lat, lng, city, userId],
        };
        try {
            const connexion = await data_source_1.pgClient.connect();
            await data_source_1.pgClient.query(insertQuery);
            connexion.release();
        }
        catch (error) {
            const errorMessage = `Failed to update user location ${userLocation}: ${error}`;
            this.logger.error(errorMessage);
        }
    }
    async findByUserId(userId) {
        const queryUserLocation = {
            text: `SELECT id FROM users_location WHERE user_id = $1 LIMIT 1`,
            values: [userId],
        };
        const connexion = await data_source_1.pgClient.connect();
        const result = await data_source_1.pgClient.query(queryUserLocation);
        connexion.release();
        const userLocation = result.rows[0];
        if (!userLocation) {
            return null;
        }
        return userLocation.id;
    }
};
exports.UserLocationRepositoryDb = UserLocationRepositoryDb;
exports.UserLocationRepositoryDb = UserLocationRepositoryDb = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_type_1.TYPE.Logger)),
    __param(1, (0, inversify_1.inject)(inversify_type_1.TYPE.GeocodeService)),
    __metadata("design:paramtypes", [Object, Object])
], UserLocationRepositoryDb);
