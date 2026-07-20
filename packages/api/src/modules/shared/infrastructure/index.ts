// Shared infrastructure layer - adapters and implementations
export { LoggerStd } from './adapters/logger-std';
export { NodeEventBus } from './adapters/node-event-bus';
export { EmailApiBrevo } from './adapters/email-api-brevo';
export { EmailApiResend } from './adapters/email-api-resend';
export { RedisCacheApi } from './adapters/redis-cache-api';
export { NotificationManager } from './adapters/notification-manager';

// Utilities
export {
  buildUserRegisteredEmailTemplate,
  buildResetPasswordEmailTemplate,
} from './utils/user.mail-template';
