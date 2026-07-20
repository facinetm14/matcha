import { UserTokenRepository } from '@/modules/auth/application/ports/repositories/user-token.repository';
import { UserRegisteredEventPayload } from '../application/dto/user-registered-event-payload';
import { EventType } from '../../shared/consts/event-type';
import { EventBus } from '../../shared/ports/event-bus';
import { Logger } from '../../shared/ports/logger.service';
import { NotificationService } from '../../notifications/application/ports/services/notification.service';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const userTokenRepository = container.get<UserTokenRepository>(
  TYPE.UserTokenRepository,
);

const notificationService = container.get<NotificationService>(
  TYPE.NotificationService,
);

eventBus.subscribe(EventType.USER_REGISTERED, async (payload: string) => {
  const UserRegisteredEventPayload = JSON.parse(
    payload,
  ) as UserRegisteredEventPayload;

  if (!UserRegisteredEventPayload) {
    logger.error(
      `Failed to handle ${EventType.USER_REGISTERED} event caused by invalid payload`,
    );

    return;
  }

  const token = await userTokenRepository.create(
    UserRegisteredEventPayload.userToken,
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
    `Sending registration notification to ${UserRegisteredEventPayload.email}`,
  );

  notificationService.createUserRegisteredNotifification(
    UserRegisteredEventPayload,
  );
});
