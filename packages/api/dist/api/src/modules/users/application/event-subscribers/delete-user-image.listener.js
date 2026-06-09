"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_type_1 = require("../../../shared/consts/event-type");
const node_path_1 = require("node:path");
const upload_dest_1 = require("../../../../modules/users/application/consts/upload-dest");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const inversify_1 = __importDefault(require("../../../../config/ioc/inversify"));
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const eventBus = inversify_1.default.get(inversify_type_1.TYPE.EventBus);
const logger = inversify_1.default.get(inversify_type_1.TYPE.Logger);
eventBus.subscribe(event_type_1.EventType.USER_IMAGE_DELETED, async (payload) => {
    const deleteImagePayload = JSON.parse(payload);
    if (!deleteImagePayload) {
        logger.error(`Failed to handle ${event_type_1.EventType.USER_IMAGE_DELETED} event caused by invalid payload`);
        return;
    }
    const fileList = deleteImagePayload.images;
    for (const filename of fileList) {
        const path = (0, node_path_1.join)(process.cwd(), upload_dest_1.UPLOAD_DEST, filename);
        if ((0, node_fs_1.existsSync)(path)) {
            await (0, promises_1.unlink)(path);
        }
    }
    logger.info(`user ${deleteImagePayload.images} images has been successfuly deleted`);
});
