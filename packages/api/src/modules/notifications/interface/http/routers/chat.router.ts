import { Request, Response, Router } from 'express';
import { injectAuthorizationToken } from '../../../../auth/interface/http/middlewares/inject-authorization-token';
import { ChatController } from '../controllers/chat.controller';
import container from '@/config/ioc/inversify';

//
const chatController = container.get(ChatController);

const ChatRouter = Router();

ChatRouter.get(
  '/channels',
  injectAuthorizationToken,
  (req: Request, resp: Response) => {
    chatController.findUserChannels(req, resp);
  },
);

export default ChatRouter;
