import { Request, Response, Router } from 'express';
import container from '../../../infrastructure/config/inversify';
import {
  injectAuthorizationToken,
} from '../middlewares/inject-authorization-token';
import { ChatController } from '../controllers/chat.controller';

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
