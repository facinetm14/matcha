"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const map_entity_or_dto_to_model_1 = require("../../../src/modules/shared/utils/map-entity-or-dto-to-model");
const factory_1 = require("../../../src/modules/shared/utils/factory");
(0, globals_1.describe)('Map any entity to its model', () => {
    (0, globals_1.test)('should convert user entity to model', () => {
        const user = (0, factory_1.factoryUser)({});
        const userModel = (0, map_entity_or_dto_to_model_1.mapEnityOrDtoToModel)(user);
        (0, globals_1.expect)(userModel).toMatchObject({
            id: globals_1.expect.any(String),
            email: globals_1.expect.any(String),
            username: globals_1.expect.any(String),
            first_name: globals_1.expect.any(String),
            last_name: globals_1.expect.any(String),
            created_at: globals_1.expect.any(Date),
            updated_at: globals_1.expect.any(Date),
            status: globals_1.expect.any(String),
            passwd: globals_1.expect.any(String),
        });
    });
    (0, globals_1.test)('should convert user token entity to model', () => {
        const userToken = (0, factory_1.factoryUserToken)({});
        const userTokenModel = (0, map_entity_or_dto_to_model_1.mapEnityOrDtoToModel)(userToken);
        (0, globals_1.expect)(userTokenModel).toMatchObject({
            ip_addr: globals_1.expect.any(String),
            id: globals_1.expect.any(String),
            category: globals_1.expect.any(String),
            token: globals_1.expect.any(String),
            device: globals_1.expect.any(String),
            created_at: globals_1.expect.any(Date),
            updated_at: globals_1.expect.any(Date),
        });
    });
});
