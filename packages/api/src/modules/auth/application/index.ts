// Application layer - use cases, ports, DTOs, errors
export { RegisterUserUseCase } from './usecases/register-user.usecase';
export { VerifyUserUseCase } from './usecases/verify-user.usecase';
export { LoginUserUseCase } from './usecases/login-user.usecase';
export { RefreshAccessTokenUseCase } from './usecases/refresh-token.usecase';
export { ResetPasswordUseCase } from './usecases/reset-password.usecase';
export { ConfrimResetPasswordUseCase } from './usecases/confirm-reset-password.usecase';
export { CreateNewPasswordUseCase } from './usecases/create-new-password.usecase';
export { LogoutUseCase } from './usecases/logout.usecase';
export { CheckUserIdentifierAvailabilityUseCase } from './usecases/check-user-identifier-availability.usecase';

// Ports
export type { UserTokenRepository } from './ports/repositories/user-token.repository';
export type {
  AccessTokenService,
  NewAccessTokenParams,
} from './ports/services/access-token.service';
export type { IpLocation } from './ports/services/ip-location-service';

// DTOs
export type { CreateUserDto } from './dto/create-user.dto';
export type { LoginUserDto } from './dto/login-user.dto';
export type { CreateNewPasswordDto } from './dto/create-new-password.dto';
export type { UserRegisteredEventPayload } from './dto/user-registered-event-payload';
export type { ResetPasswordDto } from './dto/reset-password.dto';

// Errors
export { RegisterUserError } from './errors/register-user.error';
export { LoginUserError } from './errors/login-user.error';
export { VerifyTokenError } from './errors/verify-token.error';
export { ResetPasswordError } from './errors/reset-password.error';
export { CreateNewPasswordError } from './errors/create-new-password.error';

// Constants
export { UserTokenCateory } from '../domain/consts/user-token-category';
export {
  ACCESS_TOKEN_TTL_IN_MIN,
  REFRESH_ACESS_TOKEN_TTL_IN_MS,
} from './consts/access-token-ttl';
