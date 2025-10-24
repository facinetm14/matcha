import { TYPE } from '../../../infrastructure/config/inversify-type';
import { LoginUserDto } from '../../domain/dto/login-user.dto';
import { inject, injectable } from 'inversify';
import { UserRepository } from '../../ports/repositories/user.repository';
import { Err, Ok, Result } from '../../domain/utils/result';
import { LoginUserError } from '../../domain/errors/login-user.error';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';
import { verifyPassword } from '../../../../../shared/password';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserTokenRepository } from '../../ports/repositories/user-token.repository';
import { createAccessToken } from '../../../infrastructure/utils/jwt';
import { UserTokenCateory } from '../../domain/enums/user-token-category';
import { REFRESH_ACESS_TOKEN_TTL_IN_MS } from '../../domain/consts/access-token-ttl';
import { AccessToken } from '@/core/domain/entities/access-token.entity';
import { factoryUserToken } from '@shared/factory';

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
  ) { }

  async execute(
    loginUserDto: LoginUserDto,
    device: string,
    ipAddr: string,
  ): Promise<Result<AccessToken, LoginUserError>> {
    if (!loginUserDto.username) {
      return Err(LoginUserError.INVALID_CREDENTIALS);
    }

    const existingUser = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.username,
      loginUserDto.username,
    );

    if (!existingUser) {
      return Err(LoginUserError.INVALID_CREDENTIALS);
    }

    if (existingUser.status === UserStatus.UNVERIFIED) {
      return Err(LoginUserError.USER_UNVERIFIED);
    }

    const matchPasswd = await verifyPassword(
      existingUser.passwd,
      loginUserDto.passwd,
    );

    if (!matchPasswd) {
      return Err(LoginUserError.INVALID_CREDENTIALS);
    }

    const now = new Date();
    const expireAt = new Date(now.getTime() + REFRESH_ACESS_TOKEN_TTL_IN_MS);

    const userToken = factoryUserToken({
      userId: existingUser.id,
      category: UserTokenCateory.SESSION,
      expireAt,
      createdAt: now,
      updatedAt: now,
      device,
      ipAddr,
    });

    await this.userTokenRepository.create(userToken);

    const refresh = userToken.id;
    const token = await createAccessToken(existingUser.id, userToken.token);

    return Ok({ token, refresh });
  }
}
