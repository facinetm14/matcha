import { Container } from 'inversify';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { TYPE } from './inversify-type';
import { UserRepositoryDb } from '../../adapters/repositories/user-repository-db';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';
import { UserTokenRepositoryDb } from '../../adapters/repositories/user-token-repository-db';

export function bindRepositories(container: Container) {
  container
    .bind<UserRepository>(TYPE.UserRepository)
    .to(UserRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserTokenRepository>(TYPE.UserTokenRepository)
    .to(UserTokenRepositoryDb)
    .inSingletonScope();
}
