import { Container } from "inversify";
import { AuthController } from "../../adapters/web/controllers/auth.controller";

export function bindControllers(container: Container) {
  container.bind(AuthController).toSelf().inSingletonScope();

}