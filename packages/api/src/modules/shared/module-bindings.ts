import { Container } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { Logger } from './ports/logger.service';
import { LoggerStd } from './adapters/logger-std';
import { EventBus } from './ports/event-bus';
import { NodeEventBus } from './adapters/node-event-bus';
import { NotificationService } from '../notifications/application/ports/services/notification.service';
import { NotificationManager } from './adapters/notification-manager';
import { EmailService } from './ports/email.service';
import { EmailApiBrevo } from './adapters/email-api-brevo';
import { CacheService } from './ports/cache.service';
import { RedisCacheApi } from './adapters/redis-cache-api';
import { SocketIoListener } from '@/config/event-subscribers/socket-io.listener';

export function bindSharedModule(container: Container) {
  container.bind(SocketIoListener).toSelf().inSingletonScope();
  container.bind<Logger>(TYPE.Logger).to(LoggerStd).inSingletonScope();
  container.bind<EventBus>(TYPE.EventBus).to(NodeEventBus).inSingletonScope();
  container
    .bind<NotificationService>(TYPE.NotificationService)
    .to(NotificationManager)
    .inSingletonScope();
  container
    .bind<EmailService>(TYPE.EmailService)
    .to(EmailApiBrevo)
    .inSingletonScope();
  container
    .bind<CacheService>(TYPE.CacheService)
    .to(RedisCacheApi)
    .inSingletonScope();
}
