import { EventType } from '../../core/domain/enums/event-type';
import { SocketEvents } from '../../../../shared/socket-events';
import { EventBus } from '../../core/ports/services/event-bus';
import { Logger } from '../../core/ports/services/logger.service';
import { NotificationService } from '../../core/ports/services/notification.service';
import container from '../config/inversify';
import { TYPE } from '../config/inversify-type';
import { Notification } from '@/core/domain/entities/notification.entity';
import { Server as SocketIoServer } from 'socket.io';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { VIEW_NOTIFICATION_INTERVAL_IN_MS } from '@/core/domain/utils/notificationUtils';

const eventBus = container.get<EventBus>(TYPE.EventBus);
const logger = container.get<Logger>(TYPE.Logger);
const socketIoServer = container.get<SocketIoServer>(TYPE.SocketIoServer);

const notificationService = container.get<NotificationService>(
  TYPE.NotificationService,
);

const userInteractionRepository = container.get<UserInteractionRepository>(
  TYPE.UserInteractionRepository,
);

eventBus.listenTo(EventType.USER_INTERACTION_ADDED, async (payload: string) => {
  const notification = JSON.parse(payload) as Notification;

  if (notification.category === 'view') {
    const lastView = await userInteractionRepository.findInteraction({
      author: notification.fromUser,
      recipient: notification.author,
      category: 'view',
    });

    if (!lastView) {
      await userInteractionRepository.create(
        { category: 'view', recipient: notification.author },
        notification.fromUser,
      );
    }
    
    if (
      lastView &&
      new Date(notification.createdAt).getTime() -
        new Date(lastView.createdAt).getTime() <
        VIEW_NOTIFICATION_INTERVAL_IN_MS
    ) {
      return;
    }

    if (lastView) {
      await userInteractionRepository.delete(
        { ...lastView },
        notification.fromUser,
      );
      await userInteractionRepository.create(
        { category: 'view', recipient: notification.author },
        notification.fromUser,
      );
    }
  }

  await notificationService.createNotification(notification);

  logger.info(`creating notification for ${notification.author}`);

  socketIoServer
    .to(notification.author)
    .emit(SocketEvents.USER_INTERACTION_ADDED, notification);
});
