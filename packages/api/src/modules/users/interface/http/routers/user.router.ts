import { Request, Response, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { injectAuthorizationToken } from '../../../../auth/interface/http/middlewares/inject-authorization-token';
import { uploadUserImages } from '../middlewares/upload-user-images.middleware';
import container from '@/config/ioc/inversify';
const userController = container.get(UserController);

const UserRouter = Router();

UserRouter.get(
  `/me`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.getMe(req, resp);
  },
);

UserRouter.post(
  `/search`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.filterUsers(req, resp);
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
  `/profile`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.viewUserProfileList(req, resp);
  },
);

UserRouter.get(
  `/:id/view`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.viewUserProfile(req, resp, { isViewing: true });
  },
);

UserRouter.get(
  `/:id/profile`,
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
  `/images/:key`,
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    userController.getImage(req, resp);
  },
);

UserRouter.post(
  `/images`,
  injectAuthorizationToken,
  uploadUserImages,
  (req: Request, resp: Response) => {
    userController.uploadImages(req, resp);
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

UserRouter.get('/reverse-geocode', userController.geoGode);

export default UserRouter;
