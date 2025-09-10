import { inject, injectable } from 'inversify';
import { CreateUserDto } from '../../domain/dto/create-user.dto';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { UserRepository } from '../../ports/repositories/user.repository';
import { RegisterUserError } from '../../domain/errors/register-user.error';
import { Err, Ok, Result } from '../../domain/utils/result';
import { UserUniqKeys } from '../../domain/enums/user-uniq-keys.enum';
import {
  hashPassword,
  isPasswordStrong,
  MIN_SIZE_PASSWORD,
} from '../../../../../shared/password';
import { isValidEmail } from '../../../../../shared/is-valid-email';
import { Logger } from '../../ports/services/logger.service';
import { EventBus } from '../../ports/services/event-bus';
import { EventType } from '../../domain/enums/event-type';
import { UserRegisteredPayload } from '../../domain/dto/user-registered-payload';
import { UserToken } from '../../domain/entities/user-token.entity';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.Logger) private readonly logger: Logger,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
  ) {}
  async execute(
    createUserDto: CreateUserDto,
    userToken: UserToken
  ): Promise<Result<string, RegisterUserError>> {
    const lastName = createUserDto.lastName.trim();
    if (!lastName) {
      return Err(RegisterUserError.INVALID_USER_LAST_NAME);
    }

    const firstName = createUserDto.firstName.trim();
    if (!firstName) {
      return Err(RegisterUserError.INVALID_USER_FIRST_NAME);
    }

    const passwd = createUserDto.passwd;
    if (!passwd) {
      return Err(RegisterUserError.INVALID_USER_PASSWD);
    }

    const confirmPasswd = createUserDto.confirmPasswd;
    if (passwd !== confirmPasswd) {
      return Err(RegisterUserError.MISMATCH_CONFIRM_PASSWD_WITH_PASSWD);
    }

    const isStrongPasswd = isPasswordStrong(passwd, MIN_SIZE_PASSWORD);
    if (!isStrongPasswd) {
      return Err(RegisterUserError.USER_PASSWD_WEAK);
    }

    const username = createUserDto.username.trim();
    if (!username) {
      return Err(RegisterUserError.INVALID_USER_NAME);
    }

    const existingUserWithUsername =
      await this.userRepository.findUserByUniqKey(
        UserUniqKeys.username,
        username,
      );
    if (existingUserWithUsername) {
      return Err(RegisterUserError.USER_NAME_ALREADY_EXISTS);
    }

    const email = createUserDto.email.trim();
    if (!email || !isValidEmail(email)) {
      return Err(RegisterUserError.INVALID_USER_EMAIL);
    }

    const existingUserWithUserEmail =
      await this.userRepository.findUserByUniqKey(UserUniqKeys.EMAIL, email);

    if (existingUserWithUserEmail) {
      return Err(RegisterUserError.EMAIL_ALREADY_EXISTS);
    }

    const hashedPasswd = await hashPassword(createUserDto.passwd);
    const now = new Date();

    const newUserId = await this.userRepository.create({
      ...createUserDto,
      passwd: hashedPasswd,
      createdAt: now,
      updatedAt: now,
      status: UserStatus.UNVERIFIED,
    });

    if (newUserId) {
      const userRegisteredPayload: UserRegisteredPayload = {
        id: newUserId,
        username,
        email,
        userToken
      };

      this.eventBus.emitEvent(
        EventType.USER_REGISTERED,
        JSON.stringify(userRegisteredPayload),
      );

      this.logger.success(
        `user with id ${newUserId} is sucessfully registered!`,
      );

      return Ok(userRegisteredPayload.userToken.token);
    }

    return Err(RegisterUserError.UNKNOWN_ERROR);
  }
}
