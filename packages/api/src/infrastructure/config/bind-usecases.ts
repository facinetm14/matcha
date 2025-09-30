import { Container } from 'inversify';
import { RegisterUserUseCase } from '../../core/usecases/auth/register-user.usecase';
import { VerifyUserUseCase } from '../../core/usecases/auth/verify-user.usecase';
import { LoginUserUseCase } from '../../core/usecases/auth/login-user.usecase';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';

export function bindUseCases(container: Container) {
  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
  container.bind(VerifyUserUseCase).toSelf().inSingletonScope();
  container.bind(LoginUserUseCase).toSelf().inSingletonScope();
  container.bind(GetCurrentUserUseCase).toSelf().inSingletonScope();
}
