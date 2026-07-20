import { inject } from 'inversify';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { SocketEvents } from '@shared/socket-events';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { getConnectedUserIdFromSocket } from '@/modules/auth/interface/http/middlewares/get-connected-user';
import { CacheService } from '@/modules/shared/ports/cache.service';

import { UserNotificationRepository } from '@/modules/notifications/application/ports/repositories/user-notification.repository';
import { MessageRepository } from '@/modules/notifications/application/ports/repositories/message.repository';
import { EventBus } from '@/modules/shared/ports/event-bus';
import { TYPE } from '@/config/ioc/inversify-type';
import { CreateMessageDtoSchema } from '@/modules/notifications/interface/validations/create-message-dto.validation';
import { CacheResourceKeys } from '@/modules/shared/consts/cache-ressource-keys';
import { OUTGOING_MESSAGE_TIMEOUT_MS } from '@shared/notification-time';
import { SendMessageUsceCase } from '@/modules/notifications/application/usecases/send-message.usecase';

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
    @inject(SendMessageUsceCase)
    private readonly sendMessageUseCase: SendMessageUsceCase,
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

        const lastConnection = await this.cacheService.findById(
          CacheResourceKeys.LAST_CONNEXION,
          userId,
        );

        if (lastConnection) {
          await this.cacheService.delete(
            CacheResourceKeys.LAST_CONNEXION,
            userId,
          );
        }

        this.cacheService.insert(CacheResourceKeys.LAST_CONNEXION, {
          id: userId,
          lastSeen: new Date(),
        });

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
        const interlocutor = await this.sendMessageUseCase.execute(sanitized);

        this.serverSocket
          .to([message.senderId, interlocutor])
          .timeout(OUTGOING_MESSAGE_TIMEOUT_MS)
          .emit(SocketEvents.RECEIVE_MESSAGE, sanitized.channelId);
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
          this.serverSocket
            .timeout(OUTGOING_MESSAGE_TIMEOUT_MS)
            .emit(SocketEvents.NOTIFICATION_READ, author);
        },
      );

      this.serverSocket
        .except(userId)
        .emit(SocketEvents.USER_CONNECTED, { userId });
    });
  }
}
