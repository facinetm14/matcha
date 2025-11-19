import express, { Express } from 'express';
import { baseApi } from './adapters/web/consts/base.api';
import AuthRouter from './adapters/web/routes/auth.route';
import UserRouter from './adapters/web/routes/user.routes';

import DefaultRouter from './adapters/web/routes/default.route';
import cors from 'cors';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { AuthRateLimit } from './core/domain/enums/auth-rate-limit';
import { createServer, Server as NodeServer } from 'node:http';
import { Server as SocketIoServer } from 'socket.io';
import container from './infrastructure/config/inversify';
import { TYPE } from './infrastructure/config/inversify-type';
import ChatRouter from './adapters/web/routes/chat.routes';

export const createApp = (): { server: NodeServer; app: Express } => {
  const app = express();

  const rateLimiter = rateLimit({
    windowMs: AuthRateLimit.TIME,
    limit: AuthRateLimit.REQUEST,
    ipv6Subnet: 52,
    message: 'Too many requests, please try again later.',
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

  app.use(`${baseApi}`, DefaultRouter);
  app.use(`${baseApi}/auth`, rateLimiter, AuthRouter);
  app.use(`${baseApi}/users`, UserRouter);
  app.use(`${baseApi}/chats`, ChatRouter)

  return { server, app };
};
