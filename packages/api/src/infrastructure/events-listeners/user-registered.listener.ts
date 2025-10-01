import { UserTokenRepository } from '@/core/ports/repositories/user-token.repository';
import { UserRegisteredPayload } from '../../core/domain/dto/user-registered-payload';
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

eventBus.listenTo(EventType.USER_REGISTERED, async (payload: string) => {
  const userRegisteredPayload = JSON.parse(payload) as UserRegisteredPayload;

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

  notificationService.sendUserRegisteredNotifification(userRegisteredPayload);
});
