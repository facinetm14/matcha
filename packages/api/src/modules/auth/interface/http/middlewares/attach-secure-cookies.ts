import {
  ACCESS_TOKEN_TTL_IN_MS,
  REFRESH_ACESS_TOKEN_TTL_IN_MS,
} from '@/modules/auth/application/consts/access-token-ttl';
import { Response } from 'express';

export function attachTokensToSecureCookies(
  resp: Response,
  { token, refresh }: { token: string; refresh?: string },
): void {
  clearSessionCookies(resp);

  resp.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_TTL_IN_MS,
  });

  if (refresh) {
    resp.cookie('refresh', refresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: REFRESH_ACESS_TOKEN_TTL_IN_MS,
    });
  }
}

export function clearSessionCookies(resp: Response): void {
  resp.clearCookie('refresh');
  resp.clearCookie('token');
}
