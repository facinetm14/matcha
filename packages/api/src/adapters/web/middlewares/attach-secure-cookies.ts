import {
  ACCESS_TOKEN_TTL_IN_MS,
  REFRESH_ACESS_TOKEN_TTL_IN_MS,
} from '@/core/domain/consts/access-token-ttl';
import { Response } from 'express';

export function attachTokensToSecureCookies(
  resp: Response,
  { token, refresh }: { token: string; refresh?: string },
) {
  resp.clearCookie('refresh');
  resp.clearCookie('token');

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
