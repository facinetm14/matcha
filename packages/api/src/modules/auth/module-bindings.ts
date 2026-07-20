import { Container } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { AccessTokenService } from './application/ports/services/access-token.service';
import { AccessTokenManager } from './infrastructure/adapters/services/access-token-manager';
import { IpLocation } from './application/ports/services/ip-location-service';
import { IpLocationIpApi } from './infrastructure/adapters/services/ip-location.IpApi';
import { UserTokenRepository } from './application/ports/repositories/user-token.repository';
import { UserTokenRepositoryInCache } from './infrastructure/adapters/repositories/user-token-repository-cache';
import { AuthController } from './interface/http/controllers/auth.controller';
import { CheckUserIdentifierAvailabilityUseCase } from './application/usecases/check-user-identifier-availability.usecase';
import { CreateNewPasswordUseCase } from './application/usecases/create-new-password.usecase';
import { ConfrimResetPasswordUseCase } from './application/usecases/confirm-reset-password.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { LogoutUseCase } from './application/usecases/logout.usecase';
import { RefreshAccessTokenUseCase } from './application/usecases/refresh-token.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { ResetPasswordUseCase } from './application/usecases/reset-password.usecase';
import { VerifyUserUseCase } from './application/usecases/verify-user.usecase';

export function bindAuthModule(container: Container) {
  container.bind(AuthController).toSelf().inSingletonScope();

  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
  container.bind(VerifyUserUseCase).toSelf().inSingletonScope();
  container.bind(LoginUserUseCase).toSelf().inSingletonScope();
  container
    .bind(CheckUserIdentifierAvailabilityUseCase)
    .toSelf()
    .inSingletonScope();
  container.bind(RefreshAccessTokenUseCase).toSelf().inSingletonScope();
  container.bind(ResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(ConfrimResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(CreateNewPasswordUseCase).toSelf().inSingletonScope();
  container.bind(LogoutUseCase).toSelf().inSingletonScope();

  container
    .bind<UserTokenRepository>(TYPE.UserTokenRepository)
    .to(UserTokenRepositoryInCache)
    .inSingletonScope();

  container
    .bind<AccessTokenService>(TYPE.AccessTokenService)
    .to(AccessTokenManager)
    .inSingletonScope();

  container
    .bind<IpLocation>(TYPE.IpLocation)
    .to(IpLocationIpApi)
    .inSingletonScope();
}
