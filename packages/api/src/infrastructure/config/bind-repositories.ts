import { Container } from 'inversify';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { TYPE } from './inversify-type';
import { UserRepositoryDb } from '../../adapters/repositories/user-repository-db';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';
import { UserInterestRepository } from '@/core/ports/repositories/user-interest.repository';
import { UserInterestRepositoryDb } from '@/adapters/repositories/user-interest-repository-db';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { UserInteractionRepositoryDb } from '@/adapters/repositories/user-interaction-repository-db';
import { UserImageRepository } from '@/core/ports/repositories/user-image.repository';
import { UserImageRepositoryDb } from '@/adapters/repositories/user-image-repository-db';
import { UserTokenRepositoryInCache } from '@/adapters/repositories/user-token-repository-cache';
import { UserNotificationRepository } from '@/core/ports/repositories/user-notification.repository';
import { UserNotificationRepositoryDb } from '@/adapters/repositories/user-notification-repository-db';

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
}
