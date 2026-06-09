"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipUnecessaryNotification = void 0;
const unnecessaryCategories = ['block', 'unblock', 'report', 'match', 'swipe'];
const skipUnecessaryNotification = (blocked, notificationList) => {
    return notificationList.filter((notif) => !unnecessaryCategories.includes(notif.category) &&
        !blocked.includes(notif.fromUser));
};
exports.skipUnecessaryNotification = skipUnecessaryNotification;
