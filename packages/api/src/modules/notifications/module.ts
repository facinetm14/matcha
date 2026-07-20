import { Express } from 'express';
import ChatRouter from './interface/http/routers/chat.router';
import { ApiModuleContext, ApiModuleDescriptor } from '../module-descriptor';

export const notificationsModule: ApiModuleDescriptor = {
  id: 'notifications',
  register(app: Express, context: ApiModuleContext) {
    app.use(`${context.apiBaseRoute}/chats`, ChatRouter);
  },
};
