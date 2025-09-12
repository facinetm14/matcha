import { inject, injectable } from 'inversify';
import { UserRegisteredPayload } from '../../core/domain/dto/user-registered-payload';
import { NotificationService } from '../../core/ports/services/notification.service';
import { TYPE } from '../../infrastructure/config/inversify-type';
import {
  EmailPayload,
  EmailService,
} from '../../core/ports/services/email.service';
import { buildUserRegisteredEmailTemplate } from '../../infrastructure/mail-templates/user-registered.template';

@injectable()
export class Notification implements NotificationService {
  constructor(
    @inject(TYPE.EmailService) private readonly emailService: EmailService,
  ) {}

  async sendUserRegisteredNotifification(
    payload: UserRegisteredPayload,
  ): Promise<void> {
    const clientHost = `${process.env.CLIENT_HOST}`;
    this.sendUserRegisteredEmailNotifification(payload, clientHost);
  }

  private async sendUserRegisteredEmailNotifification(
    payload: UserRegisteredPayload,
    clientHost: string,
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
}
