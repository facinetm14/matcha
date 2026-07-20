import { inject, injectable } from 'inversify';
import { Server as SocketIoServer } from 'socket.io';
import { TYPE } from '@/config/ioc/inversify-type';
import { RealtimeNotificationService } from '@/modules/notifications/application/ports/services/realtime-notification.service';

@injectable()
export class SocketIoRealtimeNotificationService
  implements RealtimeNotificationService
{
  constructor(
    @inject(TYPE.SocketIoServer)
    private readonly socketIoServer: SocketIoServer,
  ) {}

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.socketIoServer.to(userId).emit(event, payload);
  }
}
