import { EventType } from '@/modules/shared/application/consts/event-type';
import { SocketEvents } from '@shared/socket-events';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { NotificationService } from '../ports/services/notification.service';
import { Notification } from '@/modules/notifications/domain/entities/notification.entity';
import { Server as SocketIoServer } from 'socket.io';
import { UserInteractionRepository } from '@/modules/users/application/ports/repositories/user-profile-interaction.repository';
import { UserProfileInteraction } from '@/modules/users/domain/entities/user-profile-interaction.entity';
import { uuid } from '@shared/uuid';
import container from '@/config/ioc/inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { VIEW_NOTIFICATION_INTERVAL_IN_MS } from '@shared/notification-time';

const shouldPreventViewSpam = (
  lastView: UserProfileInteraction | null,
  notification: Notification,
): boolean => {
  return (
    !!lastView &&
    new Date(notification.createdAt).getTime() -
      new Date(lastView.createdAt).getTime() <=
      VIEW_NOTIFICATION_INTERVAL_IN_MS
  );
};

export function registerNotificationsEventSubscribers(): void {
  const eventBus = container.get<EventBus>(TYPE.EventBus);
  const logger = container.get<Logger>(TYPE.Logger);
  const socketIoServer = container.get<SocketIoServer>(TYPE.SocketIoServer);
  const notificationService = container.get<NotificationService>(
    TYPE.NotificationService,
  );
  const userInteractionRepository = container.get<UserInteractionRepository>(
    TYPE.UserInteractionRepository,
  );

  // USER_INTERACTION_ADDED event listener
  eventBus.subscribe(
    EventType.USER_INTERACTION_ADDED,
    async (payload: string) => {
      const notification = JSON.parse(payload) as Notification;

      if (notification.category === 'view') {
        const lastView = await userInteractionRepository.findInteraction({
          author: notification.fromUser,
          recipient: notification.author,
          category: notification.category,
        });

        if (!lastView) {
          await userInteractionRepository.create(
            {
              category: notification.category,
              recipient: notification.author,
            },
            notification.fromUser,
          );
        }

        if (shouldPreventViewSpam(lastView, notification)) {
          return;
        }

        if (lastView) {
          await userInteractionRepository.delete(
            { ...lastView },
            notification.fromUser,
          );
          await userInteractionRepository.create(
            {
              category: notification.category,
              recipient: notification.author,
            },
            notification.fromUser,
          );
        }
      }

      if (notification.category === 'like') {
        const like = await userInteractionRepository.findInteraction({
          author: notification.author,
          recipient: notification.fromUser,
          category: notification.category,
        });

        if (like) {
          await notificationService.createAppNotification({
            ...notification,
            id: uuid(),
            category: 'match',
          });
        }
      }

      if (
        notification.category === 'unlike' ||
        notification.category === 'block'
      ) {
        await notificationService.deleteMatch(
          notification.author,
          notification.fromUser,
        );
      }

      await notificationService.createAppNotification(notification);

      logger.info(`creating notification for ${notification.author}`);

      socketIoServer
        .to(notification.author)
        .emit(SocketEvents.USER_INTERACTION_ADDED, notification);
    },
  );
}
