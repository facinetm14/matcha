import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { Request, Response } from 'express';
import { Result, Ok, Err } from '@/modules/shared/utils/result';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { attachTokensToSecureCookies } from './attach-secure-cookies';
import { Socket } from 'socket.io';

export async function getConnectedUserId(
  accessTokenService: AccessTokenService,
  req: Request,
  resp: Response,
): Promise<Result<string, VerifyTokenError>> {
  const accessToken = req.token;

  if (accessToken) {
    const verifyAccessTokenResult = await accessTokenService.verifyAccessToken(accessToken);

    if (!verifyAccessTokenResult.isErr) {
      return Ok(verifyAccessTokenResult.data);
    }
  }

  const refreshToken = req.refresh;
  if (!refreshToken) {
    return Err(VerifyTokenError.INVALID_TOKEN);
  }

  const userToken = await accessTokenService.find(refreshToken);
  if (!userToken) {
    return Err(VerifyTokenError.INVALID_TOKEN);
  }

  const newAccessToken = await accessTokenService.issueNewAccessToken({
    userId: userToken.userId,
    issueAt: new Date(),
    ipAddr: userToken.ipAddr,
    device: userToken.device,
  });

  await accessTokenService.revokeToken(refreshToken);
  attachTokensToSecureCookies(resp, newAccessToken);

  return Ok(userToken.userId);
}

export async function getConnectedUserIdFromSocket(
  socket: Socket,
  accessTokenService: AccessTokenService,
): Promise<Result<string, VerifyTokenError>> {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) {
    return Err(VerifyTokenError.INVALID_TOKEN);
  }

  const [token, refresh] = cookies
    .split(';')
    .map((item) => item.slice(item.indexOf('=') + 1));

  if (!token) {
    return Err(VerifyTokenError.INVALID_TOKEN);
  }

  const verifyAccessTokenResult = await accessTokenService.verifyAccessToken(token);
  if (!verifyAccessTokenResult.isErr) {
    return Ok(verifyAccessTokenResult.data);
  }

  if (refresh) {
    const userToken = await accessTokenService.find(refresh);
    if (!userToken) {
      return Err(VerifyTokenError.INVALID_TOKEN);
    }

    return Ok(userToken.userId);
  }

  const userToken = await accessTokenService.find(token);
  if (!userToken) {
    return Err(VerifyTokenError.INVALID_TOKEN);
  }

  return Ok(userToken.userId);
}
