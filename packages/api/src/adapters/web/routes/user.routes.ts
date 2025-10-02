import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import { UserController } from '../controllers/user.controller';
import { parseBearerToken } from '../middlewares/parse-bearer-token';
const userController = container.get(UserController);

const UserRouter = Router();

UserRouter.get(`/me`, parseBearerToken, (req: Request, resp: Response) => {
  userController.getMe(req, resp);
});

UserRouter.post(`/check-identifier`, (req: Request, resp: Response) => {
  userController.checkUserIdentifierAvailability(req, resp);
});

export default UserRouter;
