import { createApp } from './app';
import container from './infrastructure/config/inversify';
import { Logger } from './core/ports/services/logger.service';
import { TYPE } from './infrastructure/config/inversify-type';

import { SocketIoListener } from './infrastructure/events-listeners/socket-io.listener';

const logger = container.get<Logger>(TYPE.Logger);
const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  const { server } = createApp();

  const socketIoLIstener = container.get(SocketIoListener);

  socketIoLIstener.handleSocketEvents();

  import('./infrastructure/events-listeners/listeners-register');

  server.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
})();
