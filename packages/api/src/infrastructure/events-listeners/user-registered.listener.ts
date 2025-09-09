import { UserRegisteredPayloadSchema } from '../../core/domain/dto/user-registered-payload';
import { EventType } from '../../core/domain/enums/event-type';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import { NotificationService } from '../../core/ports/services/notification.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const notificationService = container.get<NotificationService>(
  TYPE.NotificationService,
);

eventBus.listenTo(EventType.USER_REGISTERED, (payload: string) => {
  const payloadToJson = JSON.parse(payload);
  const parsed = UserRegisteredPayloadSchema.safeParse(payloadToJson);

  if (!parsed.success) {
    logger.error(
      `Failed to handle ${EventType.USER_REGISTERED} event caused by invalid payload`,
    );

    return;
  }

  const userRegisteredPayload = parsed.data;
  logger.info(
    `Sending registration notification to ${userRegisteredPayload.email}`,
  );

  notificationService.sendUserRegisteredNotifification(userRegisteredPayload);
});
