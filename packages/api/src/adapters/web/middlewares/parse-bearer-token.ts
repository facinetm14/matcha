import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
  }
}
export function parseBearerToken(
  req: Request,
  resp: Response,
  next: NextFunction,
) {
  const authorization = req.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    const accessToken = authorization.split(' ')[1];

    if (!accessToken) {
      resp.status(401).send('Unauthorized');
      return;
    }

    req.token = accessToken;
    return next();
  }

  resp.status(401).send('Unauthorized');
}
