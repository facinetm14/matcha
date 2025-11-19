import { ResetPasswordWishedPayload } from '@/core/domain/dto/reset-password-wished-payload';
import { UserRegisteredPayload } from '../../domain/dto/user-registered-payload';
import { Notification } from '@/core/domain/entities/notification.entity';

export interface NotificationService {
  sendUserRegisteredNotifification(
    payload: UserRegisteredPayload,
  ): Promise<void>;
  sendResetPasswordNotification(
    payload: ResetPasswordWishedPayload,
  ): Promise<void>;
  createNotification(notification: Notification): Promise<void>;
}
