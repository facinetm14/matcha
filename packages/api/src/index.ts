import { createApp } from './app';
import { SocketIoListener } from './config/event-subscribers/socket-io.listener';
import { registerAllEventSubscribers } from './config/event-subscribers/event-subscribers-bootstrap';
import container from './config/ioc/inversify';
import { TYPE } from './config/ioc/inversify-type';
import { Logger } from './modules/shared/ports/logger.service';

const logger = container.get<Logger>(TYPE.Logger);
const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  const { server } = createApp();

  const socketIoLIstener = container.get(SocketIoListener);

  socketIoLIstener.handleSocketEvents();

  registerAllEventSubscribers();

  server.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
})();
