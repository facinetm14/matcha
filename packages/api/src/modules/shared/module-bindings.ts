import { Container } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { Logger } from './application/ports/services/logger.service';
import { LoggerStd } from './infrastructure/adapters/logger-std';
import { EventBus } from './application/ports/services/event-bus';
import { NodeEventBus } from './infrastructure/adapters/node-event-bus';
import { EmailService } from './application/ports/services/email.service';
import { EmailApiResend } from './infrastructure/adapters/email-api-resend';
import { CacheService } from './application/ports/services/cache.service';
import { RedisCacheApi } from './infrastructure/adapters/redis-cache-api';
import { SocketIoListener } from '@/config/event-subscribers/socket-io.listener';

export function bindSharedModule(container: Container) {
  container.bind(SocketIoListener).toSelf().inSingletonScope();
  container.bind<Logger>(TYPE.Logger).to(LoggerStd).inSingletonScope();
  container.bind<EventBus>(TYPE.EventBus).to(NodeEventBus).inSingletonScope();
  container
    .bind<EmailService>(TYPE.EmailService)
    .to(EmailApiResend)
    .inSingletonScope();
  container
    .bind<CacheService>(TYPE.CacheService)
    .to(RedisCacheApi)
    .inSingletonScope();
}
