import { createApp } from './app';
import container from './infrastructure/config/inversify';
import { Logger } from './core/ports/services/logger.service';
import { TYPE } from './infrastructure/config/inversify-type';

import './infrastructure/events-listeners/listeners-register';

const logger = container.get<Logger>(TYPE.Logger);
const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  const app = createApp();
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
})();
