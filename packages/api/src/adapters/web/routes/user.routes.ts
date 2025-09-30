import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import { UserController } from '../controllers/user.controller';
const userController = container.get(UserController);

const UserRouter = Router();

UserRouter.get(`/me`, (req: Request, resp: Response) => {
  userController.getMe(req, resp);
});

UserRouter.post(`/check-identifier`, (req: Request, resp: Response) => {
  userController.checkUserIdentifierAvailability(req, resp);
});

export default UserRouter;
