import { Container } from 'inversify';
import { Logger } from '../../core/ports/services/logger.service';
import { TYPE } from './inversify-type';
import { LoggerStd } from '../../adapters/services/LoggerStd';
import { EventBus } from '../../core/ports/services/event-bus';
import { NodeEventBus } from '../../adapters/services/NodeEventBus';
import { NotificationService } from '../../core/ports/services/notification.service';
import { Notification } from '../../adapters/services/Notification';
import { EmailService } from '../../core/ports/services/email.service';
import { EmailApi } from '../../adapters/services/EmailApi';

export function bindServices(container: Container) {
  container.bind<Logger>(TYPE.Logger).to(LoggerStd).inSingletonScope();
  container.bind<EventBus>(TYPE.EventBus).to(NodeEventBus).inSingletonScope();
  container.bind<NotificationService>(TYPE.NotificationService).to(Notification).inSingletonScope();
  container.bind<EmailService>(TYPE.EmailService).to(EmailApi).inSingletonScope();
}
