import { Notification } from '@/core/domain/entities/notification.entity';

export interface UserNotificationRepository {
  create(notification: Notification): Promise<void>;
  findMatchByUserId(userId: string): Promise<Notification[]>;
  findMatchById(id: string): Promise<Notification | null>;
  deleteMatch(author: string, fromUser: string): Promise<void>;
}
