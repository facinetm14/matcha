import { SignJWT, jwtVerify } from 'jose';
import { Err, Ok, Result } from '../../core/domain/utils/result';
import { ACCESS_TOKEN_TTL_IN_MIN } from '../../core/domain/consts/access-token-ttl';
import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createAccessToken(
  userId: string,
  token: string,
): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL_IN_MIN)
    .setJti(token)
    .sign(key);
}

export async function verifyAccessToken(
  token: string,
): Promise<Result<string, VerifyTokenError>> {
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload && payload.sub) {
      return Ok(payload.sub as string);
    }
    return Err(VerifyTokenError.INVALID_TOKEN);
  } catch (_) {
    return Err(VerifyTokenError.TOKEN_EXPIRED);
  }
}
