import { Container } from 'inversify';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { TYPE } from './inversify-type';
import { UserRepositoryDb } from '../../adapters/repositories/user-repository-db';

export function bindRepositories(container: Container) {
  container
    .bind<UserRepository>(TYPE.UserRepository)
    .to(UserRepositoryDb)
    .inSingletonScope();
}
