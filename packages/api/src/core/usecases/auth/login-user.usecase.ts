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
import { UserToken } from '../../domain/entities/user-token.entity';

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
  ) {}

  async execute(
    loginUserDto: LoginUserDto,
    userToken: UserToken,
  ): Promise<Result<string, LoginUserError>> {
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

    const matchPasswd = verifyPassword(
      existingUser.passwd,
      loginUserDto.passwd,
    );

    if (!matchPasswd) {
      return Err(LoginUserError.INVALID_CREDENTIALS);
    }

    return Ok(userToken.id);
  }
}
