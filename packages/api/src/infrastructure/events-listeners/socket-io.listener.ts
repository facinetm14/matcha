import { inject } from 'inversify';
import { TYPE } from '../config/inversify-type';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { SocketEvents } from '@/core/domain/enums/event-type';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { getConnectedUserIdFromSocket } from '@/adapters/web/middlewares/get-connected-user';

export class SocketIoListener {
  constructor(
    @inject(TYPE.SocketIoServer)
    private readonly serverSocket: SocketIoServer,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async handleSocketEvents() {
    this.serverSocket.on(SocketEvents.CONECTION, async (socket: Socket) => {
      const connectedUserResult = await getConnectedUserIdFromSocket(
        socket,
        this.accessTokenService,
      );

      if (connectedUserResult.isErr) {
        socket.disconnect();
        return;
      }

      socket.join(connectedUserResult.data);
    });
  }
}
