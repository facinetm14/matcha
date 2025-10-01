import { Container } from 'inversify';
import { RegisterUserUseCase } from '../../core/usecases/auth/register-user.usecase';
import { VerifyUserUseCase } from '../../core/usecases/auth/verify-user.usecase';
import { LoginUserUseCase } from '../../core/usecases/auth/login-user.usecase';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import { CheckUserIdentifierAvailabilityUseCase } from '@/core/usecases/auth/check-user-identifier-availability.usecase';
import { RefreshAccessTokenUseCase } from '@/core/usecases/auth/refresh-token.usecase';

export function bindUseCases(container: Container) {
  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
  container.bind(VerifyUserUseCase).toSelf().inSingletonScope();
  container.bind(LoginUserUseCase).toSelf().inSingletonScope();
  container.bind(GetCurrentUserUseCase).toSelf().inSingletonScope();
  container
    .bind(CheckUserIdentifierAvailabilityUseCase)
    .toSelf()
    .inSingletonScope();
  container.bind(RefreshAccessTokenUseCase).toSelf().inSingletonScope();
}
