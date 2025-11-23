import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { AccessTokenManager } from '@/modules/auth/infrastructure/adapters/services/access-token-manager';
import { NotificationService } from '@/modules/notifications/application/ports/services/notification.service';
import { EmailApiBrevo } from '@/modules/shared/adapters/email-api-brevo';
import { LoggerStd } from '@/modules/shared/adapters/logger-std';
import { NodeEventBus } from '@/modules/shared/adapters/node-event-bus';
import { NotificationManager } from '@/modules/shared/adapters/notification-manager';
import { RedisCacheApi } from '@/modules/shared/adapters/redis-cache-api';
import { CacheService } from '@/modules/shared/ports/cache.service';
import { EmailService } from '@/modules/shared/ports/email.service';
import { EventBus } from '@/modules/shared/ports/event-bus';
import { Logger } from '@/modules/shared/ports/logger.service';
import { Container } from 'inversify';
import { SocketIoListener } from '../event-subscribers/socket-io.listener';
import { TYPE } from './inversify-type';

export function bindServices(container: Container) {
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
  container
    .bind<AccessTokenService>(TYPE.AccessTokenService)
    .to(AccessTokenManager)
    .inSingletonScope();
}
