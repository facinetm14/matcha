import express, { Express } from 'express';
import { baseApi } from './adapters/web/consts/base.api';
import AuthRouter from './adapters/web/routes/auth.route';
import DefaultRouter from './adapters/web/routes/default.route';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());

  app.use(`${baseApi}`, DefaultRouter);
  app.use(`${baseApi}/auth`, AuthRouter);

  return app;
};
