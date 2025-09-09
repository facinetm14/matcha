import { inject, injectable } from 'inversify';
import {
  EmailPayload,
  EmailService,
} from '../../core/ports/services/email.service';

import { TYPE } from '../../infrastructure/config/inversify-type';
import { Logger } from '../../core/ports/services/logger.service';

import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';

const emailAPI = new TransactionalEmailsApi();
emailAPI.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  `${process.env.MAIL_API_KEY}`,
);

@injectable()
export class EmailApi implements EmailService {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async send(payload: EmailPayload): Promise<void> {
    const message = new SendSmtpEmail();
    message.subject = payload.subject;
    message.htmlContent = payload.message;
    message.sender = {
      name: `${process.env.APP_NAME}`,
      email: `${process.env.FROM}`,
    };
    message.to = [{ email: payload.email, name: payload.username }];

    emailAPI.sendTransacEmail(message).then(
      () => {
        this.logger.success(`mail successfully sent to ${payload.email}`);
      },
      (error: unknown) => {
        console.error(error);
        this.logger.error(`Failed to send mail to ${payload.email}`);
      },
    );
  }
}
