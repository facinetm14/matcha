import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import { UserController } from '../controllers/user.controller';
import { injectAuthorizationToken } from '../middlewares/inject-authorization-token';
const userController = container.get(UserController);

const UserRouter = Router();

UserRouter.get(
  `/me`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.getMe(req, resp);
  },
);

UserRouter.post(`/check-identifier`, (req: Request, resp: Response) => {
  userController.checkUserIdentifierAvailability(req, resp);
});

UserRouter.patch(
  `/update`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.updateUserProfile(req, resp);
  },
);

UserRouter.post(
  `/interaction`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.addUserInteraction(req, resp);
  },
);

UserRouter.post(
  `/pictures`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.uploadPictures(req, resp);
  },
);
export default UserRouter;
