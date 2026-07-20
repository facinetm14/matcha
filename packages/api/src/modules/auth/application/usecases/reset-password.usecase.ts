import { EventType } from '@/modules/shared/application/consts/event-type';
import { UserTokenCateory } from '@/modules/auth/domain/consts/user-token-category';
import { UserUniqKeys } from '@/modules/users/application/consts/user-uniq-keys.enum';
import { ResetPasswordError } from '@/modules/auth/application/errors/reset-password.error';
import { Err, Ok, Result } from '@/modules/shared/application/utils/result';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { factoryUserToken } from '@/modules/shared/application/utils/factory';
import { injectable, inject } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.EventBus)
    private readonly eventBus: EventBus,
  ) {}

  async execute(email: string): Promise<Result<string, ResetPasswordError>> {
    const existingUser = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.EMAIL,
      email,
    );

    if (!existingUser) {
      return Err(ResetPasswordError.USER_NOT_FOUND);
    }

    const userToken = factoryUserToken({
      userId: existingUser.id,
      category: UserTokenCateory.ONE_TIME,
    });

    const payload: ResetPasswordDto = {
      email,
      username: existingUser.username,
      userToken,
    };

    this.eventBus.publish(
      EventType.RESET_PASSWORD_WISHED_BY_USER,
      JSON.stringify(payload),
    );

    return Ok(userToken.id);
  }
}
