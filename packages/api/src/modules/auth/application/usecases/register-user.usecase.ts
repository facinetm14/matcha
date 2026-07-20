import { inject, injectable } from 'inversify';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../../../users/application/ports/repositories/user.repository';
import { RegisterUserError } from '../errors/register-user.error';
import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { UserUniqKeys } from '../../../users/application/consts/user-uniq-keys.enum';
import {
  isPasswordStrong,
  PASSWORD_MIN_LENGTH,
} from '@shared/input-validation/is-valid-password';
import { PasswordHasher } from '../ports/services/password-hasher';

import { isValidEmail } from '@shared/input-validation/is-valid-email';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { EventType } from '@/modules/shared/application/consts/event-type';
import { UserRegisteredEventPayload } from '../dto/user-registered-event-payload';
import { UserStatus } from '../../../users/domain/consts/user-status.enum';
import { DEFAULT_SEXUAL_ORIENTATION } from '@/modules/users/application/consts/default-sexual-orientation';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserTokenCateory } from '../../domain/consts/user-token-category';
import { factoryUserToken } from '@/modules/shared/application/utils/factory';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.Logger) private readonly logger: Logger,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
    @inject(TYPE.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}
  async execute(
    createUserDto: CreateUserDto,
    ipAddr: string,
    device: string,
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

    const isStrongPasswd = isPasswordStrong(passwd, PASSWORD_MIN_LENGTH);
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

    const hashedPasswd = await this.passwordHasher.hash(createUserDto.passwd);
    const now = new Date();

    const newUserId = await this.userRepository.create({
      ...createUserDto,
      passwd: hashedPasswd,
      createdAt: now,
      updatedAt: now,
      status: UserStatus.UNVERIFIED,
      sexualOrientation: DEFAULT_SEXUAL_ORIENTATION,
    });

    if (newUserId) {
      const userToken = factoryUserToken({
        userId: createUserDto.id,
        category: UserTokenCateory.ONE_TIME,
        expireAt: null,
        ipAddr,
        device,
        createdAt: now,
        updatedAt: now,
      });

      const UserRegisteredEventPayload: UserRegisteredEventPayload = {
        username,
        email,
        userToken,
      };

      this.eventBus.publish(
        EventType.USER_REGISTERED,
        JSON.stringify(UserRegisteredEventPayload),
      );

      this.logger.success(
        `user with id ${newUserId} is sucessfully registered!`,
      );

      return Ok(UserRegisteredEventPayload.userToken.id);
    }

    return Err(RegisterUserError.UNKNOWN_ERROR);
  }
}
