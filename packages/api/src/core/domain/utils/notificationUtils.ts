import { Notification } from '@/core/domain/entities/notification.entity';

const unnecessaryCategories = ['block', 'unblock', 'report'];

export const skipUnecessaryNotification = (
  notificationList: Notification[],
): Notification[] => {
  return notificationList.filter(
    (notif) => !unnecessaryCategories.includes(notif.category),
  );
};

export const VIEW_NOTIFICATION_INTERVAL_IN_MS = 60 * 60 * 1000;
