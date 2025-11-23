import { ResetPasswordDto } from '@/modules/auth/application/dto/reset-password.dto';
import { UserRegisteredEventPayload } from '../../../../auth/application/dto/user-registered-event-payload';
import { Notification } from '@/modules/notifications/domain/entities/notification.entity';

export interface NotificationService {
  createUserRegisteredNotifification(
    payload: UserRegisteredEventPayload,
  ): Promise<void>;
  createResetPasswordNotification(payload: ResetPasswordDto): Promise<void>;
  createAppNotification(notification: Notification): Promise<void>;
  deleteMatch(author: string, fromUser: string): Promise<void>;
}
