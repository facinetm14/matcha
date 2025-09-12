import express, { Express } from 'express';
import { baseApi } from './adapters/web/consts/base.api';
import AuthRouter from './adapters/web/routes/auth.route';
import DefaultRouter from './adapters/web/routes/default.route';
import cors from 'cors';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { AuthRateLimit } from './core/domain/enums/auth-rate-limit';

export const createApp = (): Express => {
  const app = express();
  const rateLimiter = rateLimit({
    windowMs: AuthRateLimit.TIME,
    limit: AuthRateLimit.REQUEST,
    ipv6Subnet: 52,
  });

  app.use(cors());
  app.use(helmet());
  app.use(CookieParser());
  app.use(express.json());

  app.use(`${baseApi}`, DefaultRouter);
  app.use(`${baseApi}/auth`, rateLimiter, AuthRouter);

  return app;
};
