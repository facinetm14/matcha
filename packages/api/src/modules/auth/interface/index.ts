// Interface layer - inbound adapters (controllers, routers, middlewares)
export { AuthController } from './http/controllers/auth.controller';
export { default as AuthRouter } from './http/routers/auth.router';

// Middlewares
export {
  injectAuthorizationToken,
  injectAuthorizationTokenForLogout,
  attachTokensToSecureCookies,
  clearSessionCookies,
} from './http/middlewares/inject-authorization-token';

export {
  getConnectedUserId,
  getConnectedUserIdFromSocket,
} from './http/middlewares/get-connected-user';

// Validations
export { CreateUserDtoSchema } from './validations/create-user-dto.validation';
export { LoginUserDtoSchema } from './validations/login-user-dto.validation';
export { RefreshTokenDtoSchema } from './validations/refresh-token-dto.validation';
export { CreateResetPasswordLinkDtoSchema } from './validations/create-reset-password-link-dto.validation';
export { CreateNewPasswordDtoSchema } from './validations/create-new-password-dto.validation';
