import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    token?: string;
    refresh?: string;
  }
}
export function injectAuthorizationToken(
  req: Request,
  resp: Response,
  next: NextFunction,
) {
  const authorization = req.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    const [, accessToken, refresh] = authorization.split(' ');

    if (!accessToken) {
      resp.status(401).send('Unauthorized');
      return;
    }

    req.token = accessToken;
    req.refresh = refresh;
    return next();
  }

  const { token, refresh } = req.cookies;
  req.token = token;
  req.refresh = refresh;

  if (token) {
    return next();
  }

  resp.status(401).send('Unauthorized');
}

export function injectAuthorizationTokenForLogout(
  req: Request,
  _resp: Response,
  next: NextFunction,
) {
  const authorization = req.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    const [, accessToken, refreshToken] = authorization.split(' ');

    if (accessToken) {
      req.token = accessToken;
    }

    if (refreshToken) {
      req.refresh = refreshToken;
    }

    return next();
  }

  const { token, refresh } = req.cookies;
  req.token = token;
  req.refresh = refresh;

  return next();
}
