"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserTokenModelToEntity = mapUserTokenModelToEntity;
function mapUserTokenModelToEntity(userTokenModel) {
    return {
        id: userTokenModel.id,
        userId: userTokenModel.user_id,
        token: userTokenModel.token,
        updatedAt: userTokenModel.updated_at,
        category: userTokenModel.category,
        ipAddr: userTokenModel.ip_addr,
        createdAt: userTokenModel.created_at,
        device: userTokenModel.device,
        expireAt: userTokenModel.expire_at,
    };
}
