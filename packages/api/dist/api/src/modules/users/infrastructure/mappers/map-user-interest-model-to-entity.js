"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserInterestModelToEntity = mapUserInterestModelToEntity;
function mapUserInterestModelToEntity(userInterest) {
    return {
        id: userInterest.id,
        userId: userInterest.user_id,
        createdAt: userInterest.created_at,
        updateAt: userInterest.updated_at,
        interest: userInterest.interest,
    };
}
