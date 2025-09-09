import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import { AuthController } from '../controllers/auth.controller';

const authController = container.get(AuthController);

const AuthRouter = Router();

AuthRouter.post(`/register`, (req: Request, resp: Response) => {
  authController.registerUser(req, resp);
});

export default AuthRouter;
