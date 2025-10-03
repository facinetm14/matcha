import { Container } from 'inversify';
import { RegisterUserUseCase } from '../../core/usecases/auth/register-user.usecase';
import { VerifyUserUseCase } from '../../core/usecases/auth/verify-user.usecase';
import { LoginUserUseCase } from '../../core/usecases/auth/login-user.usecase';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import { CheckUserIdentifierAvailabilityUseCase } from '@/core/usecases/auth/check-user-identifier-availability.usecase';
import { RefreshAccessTokenUseCase } from '@/core/usecases/auth/refresh-token.usecase';
import { ResetPasswordUseCase } from '@/core/usecases/auth/reset-password.usecase';
import { ConfrimResetPasswordUseCase } from '@/core/usecases/auth/confirm-reset-password.usecase';
import { CreateNewPasswordUseCase } from '@/core/usecases/auth/create-new-password.usecase';
import { LogoutUseCase } from '@/core/usecases/auth/logout.usecase';
import { UpdateUserProfileUseCase } from '@/core/usecases/users/update-user-profile.usecase';

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
  container.bind(ResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(ConfrimResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(CreateNewPasswordUseCase).toSelf().inSingletonScope();
  container.bind(LogoutUseCase).toSelf().inSingletonScope();
  container.bind(UpdateUserProfileUseCase).toSelf().inSingletonScope();
}
