import { Container } from 'inversify';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { TYPE } from './inversify-type';
import { UserRepositoryDb } from '../../adapters/repositories/user-repository-db';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';
import { UserTokenRepositoryDb } from '../../adapters/repositories/user-token-repository-db';
import { UserInterestRepository } from '@/core/ports/repositories/user-interest.repository';
import { UserInterestRepositoryDb } from '@/adapters/repositories/user-interest-repository-db';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { UserInteractionRepositoryDb } from '@/adapters/repositories/user-interaction-repository-db';

export function bindRepositories(container: Container) {
  container
    .bind<UserRepository>(TYPE.UserRepository)
    .to(UserRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserTokenRepository>(TYPE.UserTokenRepository)
    .to(UserTokenRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserInterestRepository>(TYPE.UserInterestRepository)
    .to(UserInterestRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserInteractionRepository>(TYPE.UserInteractionRepository)
    .to(UserInteractionRepositoryDb)
    .inSingletonScope();
}
