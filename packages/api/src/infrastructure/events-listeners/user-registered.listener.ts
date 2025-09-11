import { CacheResourceKeys } from '../../core/domain/consts/cache-resource-keys';
import { UserRegisteredPayload } from '../../core/domain/dto/user-registered-payload';
import { UserToken } from '../../core/domain/entities/user-token.entity';
import { EventType } from '../../core/domain/enums/event-type';
import { CacheService } from '../../core/ports/services/cache.service';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import { NotificationService } from '../../core/ports/services/notification.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const cacheService = container.get<CacheService>(TYPE.CacheService);

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

  const token = await cacheService.insert<UserToken>(
    CacheResourceKeys.USER_TOKENS,
    userRegisteredPayload.userToken,
  );
  
  if (token) {
    logger.info(
      `Sending registration notification to ${userRegisteredPayload.email}`,
    );

    notificationService.sendUserRegisteredNotifification(userRegisteredPayload);
  }
});
