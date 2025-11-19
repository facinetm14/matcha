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

UserRouter.get(
  '/browse',
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.browse(req, resp);
  },
);
UserRouter.post(
  `/view`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.viewUserProfileList(req, resp);
  },
);
UserRouter.get(
  `/:id/view`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.viewUserProfile(req, resp);
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

UserRouter.get(
  `/images/:filename`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.getImage(req, resp);
  },
);

UserRouter.post(
  `/images/remove`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.deleteImages(req, resp);
  },
);

UserRouter.patch(
  `/images/reorder`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.reorderImages(req, resp);
  },
);

UserRouter.get(
  '/tags',
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.findAllInterests(req, resp);
  },
);

export default UserRouter;
