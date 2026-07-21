import express, { Express } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { AuthRateLimit } from './modules/auth/application/consts/auth-rate-limit';
import { createServer, Server as NodeServer } from 'node:http';
import { Server as SocketIoServer } from 'socket.io';

import container from './config/ioc/inversify';
import { TYPE } from './config/ioc/inversify-type';
import { apiModules } from './modules/module-registry';

const apiBaseRoute = process.env.BASE_API ?? '/api/v1';

export const createApp = (): { server: NodeServer; app: Express } => {
  const app = express();

  const rateLimiter = rateLimit({
    windowMs: AuthRateLimit.TIME,
    max: AuthRateLimit.REQUEST,
    keyGenerator: (req) => {
      const cfConnectingIp = req.headers['cf-connecting-ip'];

      if (typeof cfConnectingIp === 'string') {
        return cfConnectingIp;
      }

      if (Array.isArray(cfConnectingIp)) {
        return cfConnectingIp[0];
      }

      return req.ip ?? 'unknown';
    },
    validate: { xForwardedForHeader: false },
  });

  app.use(cors());
  app.use(helmet());
  app.use(CookieParser());
  app.use(express.json({ limit: '10mb' }));

  const server = createServer(app);

  const socketServer = new SocketIoServer(server, {
    cors: {
      origin: process.env.CLIENT_HOST,
      credentials: true,
    },
  });

  container
    .bind<SocketIoServer>(TYPE.SocketIoServer)
    .toConstantValue(socketServer);

  for (const module of apiModules) {
    module.register(app, {
      apiBaseRoute,
      middlewares: { authRateLimiter: rateLimiter },
    });
  }

  return { server, app };
};
