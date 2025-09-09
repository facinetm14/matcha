import { Container } from 'inversify';
import { RegisterUserUseCase } from '../../core/usecases/auth/register-user.usecase';

export function bindUseCases(container: Container) {
  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
}
