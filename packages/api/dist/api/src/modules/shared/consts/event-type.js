"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["USER_REGISTERED"] = "USER_REGISTERED";
    EventType["RESET_PASSWORD_WISHED_BY_USER"] = "RESET_PASSWORD_WISHED_BY_USER";
    EventType["UPLOAD_USER_IMAGE"] = "UPLOAD_USER_IMAGE";
    EventType["USER_IMAGE_DELETED"] = "USER_IMAGE_DELETED";
    EventType["USER_INTERACTION_ADDED"] = "USER_INTERACTION_ADDED";
    EventType["USER_DISCONNECTED"] = "USER_DISCONNECTED";
})(EventType || (exports.EventType = EventType = {}));
