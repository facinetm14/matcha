import { Express, RequestHandler } from 'express';

export type ApiModuleContext = {
  apiBaseRoute: string;
  middlewares: {
    authRateLimiter: RequestHandler;
  };
};

export interface ApiModuleDescriptor {
  id: string;
  register(app: Express, context: ApiModuleContext): void;
}
