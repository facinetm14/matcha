import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { Request, Response } from 'express';
import { Result, Ok, Err } from '@/core/domain/utils/result';
import { verifyAccessToken } from '@/infrastructure/utils/jwt';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { attachTokensToSecureCookies } from './attach-secure-cookies';

export async function getConnectedUserId(
  accessTokenService: AccessTokenService,
  req: Request,
  resp: Response,
): Promise<Result<string, VerifyTokenError>> {
  const accessToken = req.token;

  if (accessToken) {
    const verifyAccessTokenResult = await verifyAccessToken(accessToken);

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
