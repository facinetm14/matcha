import { UserTokenRepository } from '@/modules/auth/application/ports/repositories/user-token.repository';
import { EventType } from '../../shared/consts/event-type';
import { EventBus } from '../../shared/ports/event-bus';
import { Logger } from '../../shared/ports/logger.service';
import { NotificationService } from '../../notifications/application/ports/services/notification.service';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { ResetPasswordDto } from '@/modules/auth/application/dto/reset-password.dto';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const userTokenRepository = container.get<UserTokenRepository>(
  TYPE.UserTokenRepository,
);

const notificationService = container.get<NotificationService>(
  TYPE.NotificationService,
);

eventBus.subscribe(
  EventType.RESET_PASSWORD_WISHED_BY_USER,
  async (payload: string) => {
    const resetPasswordPayload = JSON.parse(payload) as ResetPasswordDto;

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

    notificationService.createResetPasswordNotification(resetPasswordPayload);
  },
);
