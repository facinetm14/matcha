import { Express } from 'express';
import AuthRouter from './interface/http/routers/auth.router';
import { ApiModuleContext, ApiModuleDescriptor } from '../module-descriptor';

export const authModule: ApiModuleDescriptor = {
  id: 'auth',
  register(app: Express, context: ApiModuleContext) {
    app.use(
      `${context.apiBaseRoute}/auth`,
      context.middlewares.authRateLimiter,
      AuthRouter,
    );
  },
};
