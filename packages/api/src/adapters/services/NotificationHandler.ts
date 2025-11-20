import { inject, injectable } from 'inversify';
import { UserRegisteredPayload } from '../../core/domain/dto/user-registered-payload';
import { NotificationService } from '../../core/ports/services/notification.service';
import { TYPE } from '../../infrastructure/config/inversify-type';
import {
  EmailPayload,
  EmailService,
} from '../../core/ports/services/email.service';
import {
  buildResetPasswordEmailTemplate,
  buildUserRegisteredEmailTemplate,
} from '../../infrastructure/mail-templates/user-registered.template';
import { ResetPasswordWishedPayload } from '@/core/domain/dto/reset-password-wished-payload';
import { UserNotificationRepository } from '@/core/ports/repositories/user-notification.repository';
import { Notification } from '@/core/domain/entities/notification.entity';

const clientHost = `${process.env.CLIENT_HOST}`;
@injectable()
export class NotificationHandler implements NotificationService {
  constructor(
    @inject(TYPE.EmailService) private readonly emailService: EmailService,
    @inject(TYPE.UserNotificationRepository)
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  async sendUserRegisteredNotifification(
    payload: UserRegisteredPayload,
  ): Promise<void> {
    const verifyLink = `${clientHost}/verify/${payload.userToken.id}`;

    const emailPayload: EmailPayload = {
      email: payload.email,
      message: buildUserRegisteredEmailTemplate(payload.username, verifyLink),
      subject: 'User Registration',
      username: payload.username,
    };
    this.emailService.send(emailPayload);
  }

  async sendResetPasswordNotification(
    payload: ResetPasswordWishedPayload,
  ): Promise<void> {
    const verifyLink = `${clientHost}/new-password/${payload.userToken.id}`;

    const emailPayload: EmailPayload = {
      email: payload.email,
      message: buildResetPasswordEmailTemplate(payload.username, verifyLink),
      subject: 'Reset Password',
      username: payload.username,
    };
    this.emailService.send(emailPayload);
  }

  async createNotification(notification: Notification): Promise<void> {
    return this.userNotificationRepository.create(notification);
  }

  async deleteMatch(author: string, fromUser: string): Promise<void> {
    return this.userNotificationRepository.deleteMatch(author, fromUser);
  }
}
