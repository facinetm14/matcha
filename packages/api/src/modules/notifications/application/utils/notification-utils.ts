import { Notification } from '@/modules/notifications/domain/entities/notification.entity';

const unnecessaryCategories = ['block', 'unblock', 'report', 'match', 'swipe'];

export const skipUnecessaryNotification = (
  blocked: string[],
  notificationList: Notification[],
): Notification[] => {
  return notificationList.filter(
    (notif) =>
      !unnecessaryCategories.includes(notif.category) &&
      !blocked.includes(notif.fromUser),
  );
};
