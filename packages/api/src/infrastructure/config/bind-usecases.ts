import { Container } from 'inversify';
import { RegisterUserUseCase } from '../../core/usecases/auth/register-user.usecase';
import { VerifyUserUseCase } from '../../core/usecases/auth/verify-user.usecase';

export function bindUseCases(container: Container) {
  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
  container.bind(VerifyUserUseCase).toSelf().inSingletonScope();
}
