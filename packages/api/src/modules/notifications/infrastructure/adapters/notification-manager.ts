import { inject, injectable } from 'inversify';
import { UserRegisteredEventPayload } from '@/modules/auth/application/dto/user-registered-event-payload';
import { NotificationService } from '@/modules/notifications/application/ports/services/notification.service';
import {
  EmailPayload,
  EmailService,
} from '@/modules/shared/application/ports/services/email.service';

import { UserNotificationRepository } from '@/modules/notifications/application/ports/repositories/user-notification.repository';
import { Notification } from '@/modules/notifications/domain/entities/notification.entity';
import { EmailSubject } from '@/modules/shared/application/consts/email-subject';
import { ResetPasswordDto } from '@/modules/auth/application/dto/reset-password.dto';
import { TYPE } from '@/config/ioc/inversify-type';
import {
  buildResetPasswordEmailTemplate,
  buildUserRegisteredEmailTemplate,
} from '../utils/user-mail-template';

const clientHost = `${process.env.CLIENT_HOST}`;
@injectable()
export class NotificationManager implements NotificationService {
  constructor(
    @inject(TYPE.EmailService) private readonly emailService: EmailService,
    @inject(TYPE.UserNotificationRepository)
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  async createUserRegisteredNotifification(
    payload: UserRegisteredEventPayload,
  ): Promise<void> {
    const verifyLink = `${clientHost}/verify/${payload.userToken.id}`;

    const emailPayload: EmailPayload = {
      email: payload.email,
      message: buildUserRegisteredEmailTemplate(payload.username, verifyLink),
      subject: EmailSubject.USER_REGISTRATION,
      username: payload.username,
    };
    this.emailService.send(emailPayload);
  }

  async createResetPasswordNotification(
    payload: ResetPasswordDto,
  ): Promise<void> {
    const verifyLink = `${clientHost}/new-password/${payload.userToken.id}`;

    const emailPayload: EmailPayload = {
      email: payload.email,
      message: buildResetPasswordEmailTemplate(payload.username, verifyLink),
      subject: EmailSubject.REST_PASSWORD,
      username: payload.username,
    };
    this.emailService.send(emailPayload);
  }

  async createAppNotification(notification: Notification): Promise<void> {
    return this.userNotificationRepository.create(notification);
  }

  async deleteMatch(author: string, fromUser: string): Promise<void> {
    return this.userNotificationRepository.deleteMatch(author, fromUser);
  }
}
