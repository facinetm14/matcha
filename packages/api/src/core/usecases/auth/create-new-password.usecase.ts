import { CreateNewPasswordDto } from '@/core/domain/dto/create-new-password.dto';
import { CreateNewPasswordError } from '@/core/domain/errors/create-new-password.error';
import { inject, injectable } from 'inversify';
import { Result, Err, Ok } from '@/core/domain/utils/result';
import { hashPassword } from '@shared/password';
import { isPasswordStrong } from '@shared/input-validation/is-valid-password';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';

@injectable()
export class CreateNewPasswordUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) { }

  async execute(
    createNewPasswordDto: CreateNewPasswordDto,
    userId: string,
  ): Promise<Result<null, CreateNewPasswordError>> {
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
