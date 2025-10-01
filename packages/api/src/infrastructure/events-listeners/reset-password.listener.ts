import { UserTokenRepository } from '@/core/ports/repositories/user-token.repository';
import { ResetPasswordWishedPayload } from '@/core/domain/dto/reset-password-wished-payload';
import { EventType } from '../../core/domain/enums/event-type';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import { NotificationService } from '../../core/ports/services/notification.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const userTokenRepository = container.get<UserTokenRepository>(
  TYPE.UserTokenRepository,
);

const notificationService = container.get<NotificationService>(
  TYPE.NotificationService,
);

eventBus.listenTo(
  EventType.RESET_PASSWORD_WISHED_BY_USER,
  async (payload: string) => {
    const resetPasswordPayload = JSON.parse(
      payload,
    ) as ResetPasswordWishedPayload;

    if (!resetPasswordPayload) {
      logger.error(
        `Failed to handle ${EventType.RESET_PASSWORD_WISHED_BY_USER} event caused by invalid payload`,
      );
      return;
    }

    const token = await userTokenRepository.create(
      resetPasswordPayload.userToken,
    );

    if (!token) {
      logger.error(
        `Failed to handle ${EventType.RESET_PASSWORD_WISHED_BY_USER} event caused by failure to store user token in cache`,
      );
      return;
    }

    if (process.env.DEBUG === 'true') {
      logger.info(
        `Received event: ${EventType.RESET_PASSWORD_WISHED_BY_USER} but sending email is skipped in debug mode`,
      );
      return;
    }

    logger.info(
      `Sending reset password notification to ${resetPasswordPayload.email}`,
    );

    notificationService.sendResetPasswordNotification(resetPasswordPayload);
  },
);
