import { UserTokenRepository } from '@/modules/auth/application/ports/repositories/user-token.repository';
import { UserRegisteredEventPayload } from '../application/dto/user-registered-event-payload';
import { EventType } from '../../shared/consts/event-type';
import { EventBus } from '../../shared/ports/event-bus';
import { Logger } from '../../shared/ports/logger.service';
import { NotificationService } from '../../notifications/application/ports/services/notification.service';
import { ResetPasswordDto } from '@/modules/auth/application/dto/reset-password.dto';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

export function registerAuthEventSubscribers(): void {
  const eventBus = container.get<EventBus>(TYPE.EventBus);
  const logger = container.get<Logger>(TYPE.Logger);
  const userTokenRepository = container.get<UserTokenRepository>(
    TYPE.UserTokenRepository,
  );
  const notificationService = container.get<NotificationService>(
    TYPE.NotificationService,
  );

  // USER_REGISTERED event listener
  eventBus.subscribe(EventType.USER_REGISTERED, async (payload: string) => {
    const userRegisteredPayload = JSON.parse(
      payload,
    ) as UserRegisteredEventPayload;

    if (!userRegisteredPayload) {
      logger.error(
        `Failed to handle ${EventType.USER_REGISTERED} event caused by invalid payload`,
      );
      return;
    }

    const token = await userTokenRepository.create(
      userRegisteredPayload.userToken,
    );

    if (!token) {
      logger.error(
        `Failed to handle ${EventType.USER_REGISTERED} event caused by failure to store user token in cache`,
      );
      return;
    }

    if (process.env.DEBUG === 'true') {
      logger.info(
        `Received event: ${EventType.USER_REGISTERED} but sending email is skipped in debug mode`,
      );
      return;
    }

    logger.info(
      `Sending registration notification to ${userRegisteredPayload.email}`,
    );

    notificationService.createUserRegisteredNotifification(
      userRegisteredPayload,
    );
  });

  // RESET_PASSWORD_WISHED_BY_USER event listener
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
}
