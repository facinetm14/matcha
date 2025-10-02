import { CreateNewPasswordDto } from '@/core/domain/dto/create-new-password.dto';
import { CreateNewPasswordError } from '@/core/domain/errors/create-new-password.error';
import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { verifyAccessToken } from '@/infrastructure/utils/jwt';
import { inject, injectable } from 'inversify';
import { Result, Err, Ok } from '@/core/domain/utils/result';
import { hashPassword, isPasswordStrong } from '@shared/password';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';

@injectable()
export class CreateNewPasswordUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    createNewPasswordDto: CreateNewPasswordDto,
    token: string,
  ): Promise<Result<null, CreateNewPasswordError>> {
    const verifyTokenResult = await verifyAccessToken(token);
    if (verifyTokenResult.isErr) {
      const error = verifyTokenResult.error;
      if (error === VerifyTokenError.TOKEN_EXPIRED) {
        return Err(CreateNewPasswordError.EXPIRED_TOKEN);
      }
      return Err(CreateNewPasswordError.INVALID_TOKEN);
    }
    const userId = verifyTokenResult.data;

    const existingUser = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      userId,
    );
    if (!existingUser) {
      return Err(CreateNewPasswordError.USER_NOT_FOUND);
    }

    if (!isPasswordStrong(createNewPasswordDto.passwd)) {
      return Err(CreateNewPasswordError.WEAK_PASSWORD);
    }

    if (createNewPasswordDto.passwd !== createNewPasswordDto.confirmPasswd) {
      return Err(CreateNewPasswordError.MIS_MATCH_PASSWORD);
    }

    const passwd = await hashPassword(createNewPasswordDto.passwd);
    const userWithNewPassword = {
      passwd,
    };

    const updatedUser = await this.userRepository.update(
      existingUser.id,
      userWithNewPassword,
    );

    if (!updatedUser) {
      return Err(CreateNewPasswordError.UNKNOWN_ERROR);
    }

    return Ok(null);
  }
}
