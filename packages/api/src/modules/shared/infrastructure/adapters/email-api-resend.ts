import { inject, injectable } from 'inversify';

import { TYPE } from '@/config/ioc/inversify-type';

import { Resend } from 'resend';
import {
  EmailPayload,
  EmailService,
} from '../../application/ports/services/email.service';
import { Logger } from '../../application/ports/services/logger.service';

const resend = new Resend(`${process.env.MAIL_API_KEY}`);

@injectable()
export class EmailApiResend implements EmailService {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async send(payload: EmailPayload): Promise<void> {
    (async () => {
      const { data, error } = await resend.emails.send({
        from: `${process.env.NO_REPLY_ADDRESS}`,
        to: `${payload.email}`,
        subject: payload.subject,
        html: payload.message,
      });

      if (error) {
        this.logger.error(`Failed to send mail to ${payload.email}`);
        this.logger.error(error.message);
        return;
      }

      this.logger.success(
        `Email sent to ${payload.email} with subject "${payload.subject}"`,
      );
    })();
  }
}
