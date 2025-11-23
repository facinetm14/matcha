import { Container } from 'inversify';
import { TYPE } from './inversify-type';
import { UserInterestRepository } from '@/modules/users/application/ports/repositories/user-interest.repository';
import { UserInterestRepositoryDb } from '@/modules/users/infrastructure/adapters/repositories/user-interest-repository-db';
import { UserInteractionRepository } from '@/modules/users/application/ports/repositories/user-profile-interaction.repository';
import { UserInteractionRepositoryDb } from '@/modules/users/infrastructure/adapters/repositories/user-interaction-repository-db';
import { UserImageRepository } from '@/modules/users/application/ports/repositories/user-image.repository';
import { UserImageRepositoryDb } from '@/modules/users/infrastructure/adapters/repositories/user-image-repository-db';
import { UserTokenRepositoryInCache } from '@/modules/auth/infrastructure/adapters/repositories/user-token-repository-cache';
import { UserNotificationRepository } from '@/modules/notifications/application/ports/repositories/user-notification.repository';
import { UserNotificationRepositoryDb } from '@/modules/users/infrastructure/adapters/repositories/user-notification-repository-db';
import { MessageRepository } from '@/modules/notifications/application/ports/repositories/message.repository';
import { MessageRepositoryDb } from '@/modules/notifications/infrastructure/adapters/repositories/message-repository-db';
import { UserTokenRepository } from '@/modules/auth/application/ports/repositories/user-token.repository';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { UserRepositoryDb } from '@/modules/users/infrastructure/adapters/repositories/user-repository-db';

export function bindRepositories(container: Container) {
  container
    .bind<UserRepository>(TYPE.UserRepository)
    .to(UserRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserTokenRepository>(TYPE.UserTokenRepository)
    .to(UserTokenRepositoryInCache)
    .inSingletonScope();

  container
    .bind<UserInterestRepository>(TYPE.UserInterestRepository)
    .to(UserInterestRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserInteractionRepository>(TYPE.UserInteractionRepository)
    .to(UserInteractionRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserNotificationRepository>(TYPE.UserNotificationRepository)
    .to(UserNotificationRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserImageRepository>(TYPE.UserImageRepository)
    .to(UserImageRepositoryDb)
    .inSingletonScope();

  container
    .bind<MessageRepository>(TYPE.MessageRepository)
    .to(MessageRepositoryDb)
    .inSingletonScope();
}
