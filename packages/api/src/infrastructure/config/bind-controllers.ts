import { Container } from "inversify";
import { AuthController } from "../../adapters/web/controllers/auth.controller";
import { UserController } from "../../adapters/web/controllers/user.controller";

export function bindControllers(container: Container) {
  container.bind(AuthController).toSelf().inSingletonScope();
  container.bind(UserController).toSelf().inSingletonScope();

}