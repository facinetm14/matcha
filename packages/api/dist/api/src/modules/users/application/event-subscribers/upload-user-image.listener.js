"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_type_1 = require("../../../shared/consts/event-type");
const socket_events_1 = require("../../../../../../shared/socket-events");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const upload_dest_1 = require("../../../../modules/users/application/consts/upload-dest");
const node_fs_1 = require("node:fs");
const inversify_1 = __importDefault(require("../../../../config/ioc/inversify"));
const inversify_type_1 = require("../../../../config/ioc/inversify-type");
const eventBus = inversify_1.default.get(inversify_type_1.TYPE.EventBus);
const logger = inversify_1.default.get(inversify_type_1.TYPE.Logger);
const userImageRepository = inversify_1.default.get(inversify_type_1.TYPE.UserImageRepository);
const socketIoServer = inversify_1.default.get(inversify_type_1.TYPE.SocketIoServer);
const isValidBase64Image = (base64) => {
    const regex = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/]+=*$/;
    return regex.test(base64);
};
eventBus.subscribe(event_type_1.EventType.UPLOAD_USER_IMAGE, async (payload) => {
    const userImagePayload = JSON.parse(payload);
    if (!userImagePayload) {
        logger.error(`Failed to handle ${event_type_1.EventType.UPLOAD_USER_IMAGE} event caused by invalid payload`);
        return;
    }
    const userImageList = [];
    for (const image of userImagePayload.photos) {
        if (!isValidBase64Image(image.dataInBase64)) {
            logger.error(`Invalid image format ${image.position}. Only JPEG and PNG are allowed`);
            break;
        }
        const matches = image.dataInBase64.match(/^data:image\/(jpeg|png);base64,(.+)$/) ?? [];
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const filename = `${userImagePayload.author}-image-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const uploadDirectory = (0, node_path_1.join)(process.cwd(), upload_dest_1.UPLOAD_DEST);
        if (!(0, node_fs_1.existsSync)(uploadDirectory)) {
            (0, node_fs_1.mkdirSync)(uploadDirectory, { recursive: true });
        }
        const path = (0, node_path_1.join)(uploadDirectory, filename);
        try {
            await (0, promises_1.writeFile)(path, buffer);
            userImageList.push({ position: image.position, preview: filename });
        }
        catch (error) {
            logger.error(`Failed to save image. Reason: ${error}`);
        }
    }
    if (userImageList.length) {
        await userImageRepository.bulkCreate(userImagePayload.author, userImageList);
        socketIoServer
            .to(userImagePayload.author)
            .emit(socket_events_1.SocketEvents.USER_IMAGE_UPLOADED);
    }
});
