import express, { Express } from 'express';
import AuthRouter from './modules/auth/interface/http/routers/auth.router';
import UserRouter from './modules/users/interface/http/routers/user.router';

import cors from 'cors';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { AuthRateLimit } from './modules/auth/application/consts/auth-rate-limit';
import { createServer, Server as NodeServer } from 'node:http';
import { Server as SocketIoServer } from 'socket.io';
import ChatRouter from './modules/notifications/interface/http/routers/chat.router';

import container from './config/ioc/inversify';
import { TYPE } from './config/ioc/inversify-type';


const apiBaseRoute = process.env.BASE_API ?? '/api/v1';

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

  app.use(`${apiBaseRoute}/auth`, rateLimiter, AuthRouter);
  app.use(`${apiBaseRoute}/users`, UserRouter);
  app.use(`${apiBaseRoute}/chats`, ChatRouter);

  return { server, app };
};

