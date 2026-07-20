import { Notification } from '@/modules/notifications/domain/entities/notification.entity';
import { UserNotificationModel } from '../models/user-notification.model';

export function mapUserNotificationModelToEntity(
  userNotificationModel: UserNotificationModel,
): Notification {
  return {
    id: userNotificationModel.id,
    author: userNotificationModel.author,
    fromUser: userNotificationModel.from_user,
    category: userNotificationModel.category as Notification['category'],
    isRead: Boolean(userNotificationModel.is_read),
    createdAt: userNotificationModel.created_at,
    updatedAt: userNotificationModel.updated_at,
  };
}
