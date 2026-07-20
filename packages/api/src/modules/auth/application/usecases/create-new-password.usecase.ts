import { CreateNewPasswordError } from '@/modules/auth/application/errors/create-new-password.error';
import { inject, injectable } from 'inversify';
import { Result, Err, Ok } from '@/modules/shared/application/utils/result';
import { PasswordHasher } from '@/modules/auth/application/ports/services/password-hasher';
import { isPasswordStrong } from '@shared/input-validation/is-valid-password';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { UserUniqKeys } from '@/modules/users/application/consts/user-uniq-keys.enum';
import { TYPE } from '@/config/ioc/inversify-type';
import { CreateNewPasswordDto } from '../dto/create-new-password.dto';

@injectable()
export class CreateNewPasswordUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

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

    const passwd = await this.passwordHasher.hash(createNewPasswordDto.passwd);
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
