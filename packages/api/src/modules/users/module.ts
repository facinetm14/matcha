import { Express } from 'express';
import UserRouter from './interface/http/routers/user.router';
import { ApiModuleContext, ApiModuleDescriptor } from '../module-descriptor';

export const usersModule: ApiModuleDescriptor = {
  id: 'users',
  register(app: Express, context: ApiModuleContext) {
    app.use(`${context.apiBaseRoute}/users`, UserRouter);
  },
};
