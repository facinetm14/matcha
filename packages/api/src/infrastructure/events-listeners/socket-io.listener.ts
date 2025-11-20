import { inject } from 'inversify';
import { TYPE } from '../config/inversify-type';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { SocketEvents } from '../../../../shared/socket-events';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { getConnectedUserIdFromSocket } from '@/adapters/web/middlewares/get-connected-user';
import { CacheService } from '@/core/ports/services/cache.service';
import { CacheResourceKeys } from '@/core/domain/consts/cache-resource-keys';
import { EventBus } from '@/core/ports/services/event-bus';
import { CreateMessageDtoSchema } from '@/core/domain/dto/message.dto';
import { UserNotificationRepository } from '@/core/ports/repositories/user-notification.repository';
import { MessageRepository } from '@/core/ports/repositories/message.repository';
import { Message } from '@/core/domain/entities/message.entity';
import { uuid } from '@shared/uuid';
import { Notification } from '@/core/domain/entities/notification.entity';
import { EventType } from '@/core/domain/enums/event-type';

export class SocketIoListener {
  constructor(
    @inject(TYPE.SocketIoServer)
    private readonly serverSocket: SocketIoServer,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
    @inject(TYPE.CacheService)
    private readonly cacheService: CacheService,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
    @inject(TYPE.UserNotificationRepository)
    private readonly userNotificationRepository: UserNotificationRepository,
    @inject(TYPE.MessageRepository)
    private readonly messageRepository: MessageRepository,
  ) {}

  async handleSocketEvents() {
    this.serverSocket.on(SocketEvents.CONNECTION, async (socket: Socket) => {
      const connectedUserResult = await getConnectedUserIdFromSocket(
        socket,
        this.accessTokenService,
      );

      if (connectedUserResult.isErr) {
        socket.disconnect(true);
        return;
      }

      const userId = connectedUserResult.data;
      const isConnectedUser = await this.cacheService.findById(
        CacheResourceKeys.CONNECTED_USERS,
        userId,
      );

      if (!isConnectedUser) {
        await this.cacheService.insert(CacheResourceKeys.CONNECTED_USERS, {
          id: userId,
        });
      }

      socket.join(userId);

      socket.on(SocketEvents.DISCONNECT, async () => {
        await this.cacheService.delete(
          CacheResourceKeys.CONNECTED_USERS,
          userId,
        );

        socket.leave(userId);
        socket.disconnect(true);

        this.serverSocket
          .except(userId)
          .emit(SocketEvents.USER_DISCONNECTED, { userId });
      });

      socket.on(SocketEvents.SEND_MESSAGE, async (message) => {
        const parseMessage = CreateMessageDtoSchema.safeParse(message);
        if (!parseMessage.success) {
          return;
        }

        const sanitized = parseMessage.data;
        const channel = await this.userNotificationRepository.findMatchById(
          sanitized.channelId,
        );
        if (!channel) {
          return;
        }

        if (
          sanitized.senderId !== channel.author &&
          sanitized.senderId !== channel.fromUser
        ) {
          return;
        }

        const now = new Date();
        const newMessage: Message = {
          id: uuid(),
          senderId: sanitized.senderId,
          content: sanitized.content,
          channelId: sanitized.channelId,
          isRead: false,
          createdAt: now,
          updatedAt: now,
        };

        await this.messageRepository.create(newMessage);

        const interlocutor =
          channel.author === sanitized.senderId
            ? channel.fromUser
            : channel.author;

        const notification: Notification = {
          id: `${uuid()}-msg-${sanitized.channelId}`,
          author: interlocutor,
          fromUser: newMessage.senderId,
          category: 'message',
          createdAt: now,
          updatedAt: now,
          isRead: false,
        };

        this.eventBus.emitEvent(
          EventType.USER_INTERACTION_ADDED,
          JSON.stringify(notification),
        );

        this.serverSocket
          .to([interlocutor, newMessage.senderId])
          .emit(SocketEvents.RECEIVE_MESSAGE, channel.id);
      });

      socket.on(
        SocketEvents.READING_NOTIFICATION,
        async ({ category, author }) => {
          if (category !== 'message') {
            await this.userNotificationRepository.updateReadStatusById(author);
          } else {
            await this.userNotificationRepository.updateReadStatusByAuthorAndFromUser(
              userId,
              author,
            );
          }
          this.serverSocket.emit(SocketEvents.NOTIFICATION_READ, author);
        },
      );

      this.serverSocket
        .except(userId)
        .emit(SocketEvents.USER_CONNECTED, { userId });
    });
  }
}
