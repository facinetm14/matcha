import { Container } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { ChatController } from './interface/http/controllers/chat.controller';
import { GetUserChannelsUseCase } from './application/usecases/get-user-channels.usecase';
import { SendMessageUsceCase } from './application/usecases/send-message.usecase';
import { MessageRepository } from './application/ports/repositories/message.repository';
import { MessageRepositoryDb } from './infrastructure/adapters/repositories/message-repository-db';
import { UserNotificationRepository } from './application/ports/repositories/user-notification.repository';
import { UserNotificationRepositoryDb } from './infrastructure/adapters/repositories/user-notification-repository-db';

export function bindNotificationsModule(container: Container) {
  container.bind(ChatController).toSelf().inSingletonScope();

  container.bind(GetUserChannelsUseCase).toSelf().inSingletonScope();
  container.bind(SendMessageUsceCase).toSelf().inSingletonScope();

  container
    .bind<MessageRepository>(TYPE.MessageRepository)
    .to(MessageRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserNotificationRepository>(TYPE.UserNotificationRepository)
    .to(UserNotificationRepositoryDb)
    .inSingletonScope();
}
