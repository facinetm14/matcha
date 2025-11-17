import { inject } from 'inversify';
import { TYPE } from '../config/inversify-type';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { SocketEvents } from '@/core/domain/enums/event-type';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { getConnectedUserIdFromSocket } from '@/adapters/web/middlewares/get-connected-user';
import { CacheService } from '@/core/ports/services/cache.service';
import { CacheResourceKeys } from '@/core/domain/consts/cache-resource-keys';

export class SocketIoListener {
  constructor(
    @inject(TYPE.SocketIoServer)
    private readonly serverSocket: SocketIoServer,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
    @inject(TYPE.CacheService)
    private readonly cacheService: CacheService,
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
      });
    });
  }
}
