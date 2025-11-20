
import { inject, injectable } from 'inversify';
import { UserRepository } from '../../../users/application/ports/repositories/user.repository';
import { Err, Ok, Result } from '../../../shared/utils/result';
import { LoginUserError } from '../errors/login-user.error';
import { UserUniqKeys } from '../../../users/application/consts/user-uniq-keys.enum';
import { verifyPassword } from '../../infrastructure/utils/password';
import { UserStatus } from '../../../users/application/consts/user-status.enum';
import { UserTokenRepository } from '../ports/repositories/user-token.repository';
import { UserTokenCateory } from '../consts/user-token-category';
import { REFRESH_ACESS_TOKEN_TTL_IN_MS } from '../consts/access-token-ttl';
import { AccessToken } from '@/modules/auth/domain/entities/access-token.entity';
import { factoryUserToken } from '@/modules/shared/utils/factory';
import { AccessTokenService } from '../ports/services/access-token.service';
import { TYPE } from '@/config/ioc/inversify-type';
import { LoginUserDto } from '../dto/login-user.dto';

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {}

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
    const token = await this.accessTokenService.createAccessToken(
      existingUser.id,
      userToken.token,
    );

    return Ok({ token, refresh });
  }
}
