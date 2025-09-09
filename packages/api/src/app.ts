import express, { Express } from 'express';
import { baseApi } from './adapters/web/consts/base.api';
import AuthRouter from './adapters/web/routes/auth.route';
import DefaultRouter from './adapters/web/routes/default.route';
import cors from 'cors';

export const createApp = (): Express => {
  const app = express();

  app.use(cors())
  app.use(express.json());

  app.use(`${baseApi}`, DefaultRouter);
  app.use(`${baseApi}/auth`, AuthRouter);
  app.use(`${baseApi}`, DefaultRouter);
  app.use(`${baseApi}/auth`, AuthRouter);

  return app;
};
