import { Container } from 'inversify';
import { ChatController } from '@/modules/notifications/interface/http/controllers/chat.controller';
import { AuthController } from '@/modules/auth/interface/http/controllers/auth.controller';
import { UserController } from '@/modules/users/interface/http/controllers/user.controller';

export function bindControllers(container: Container) {
  container.bind(AuthController).toSelf().inSingletonScope();
  container.bind(UserController).toSelf().inSingletonScope();
  container.bind(ChatController).toSelf().inSingletonScope();
}
