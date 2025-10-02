import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import { AuthController } from '../controllers/auth.controller';
import { parseBearerToken } from '../middlewares/parse-bearer-token';

const authController = container.get(AuthController);

const AuthRouter = Router();

AuthRouter.post(`/register`, (req: Request, resp: Response) => {
  authController.registerUser(req, resp);
});


AuthRouter.post('/verify/:validationToken', (req: Request, resp: Response) => {
  authController.verifyUserEmail(req, resp);
});


AuthRouter.post('/login', (req: Request, resp: Response) => {
  authController.loginUser(req, resp);
});

AuthRouter.post('/refresh-token', (req: Request, resp: Response) => {
  authController.refreshToken(req, resp);
});

AuthRouter.post('/reset-password', (req: Request, resp: Response) => {
  authController.resetPassword(req, resp);
});

AuthRouter.post('/confirm-reset-password', (req: Request, resp: Response) => {
  authController.confirmResetPassword(req, resp);
})

AuthRouter.post('/create-new-password', parseBearerToken, (req: Request, resp: Response) => {
  authController.createNewPassword(req, resp);
})

export default AuthRouter;
