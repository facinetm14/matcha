import { ResetPasswordWishedPayload } from '@/core/domain/dto/reset-password-wished-payload';
import { EventType } from '@/core/domain/enums/event-type';
import { UserTokenCateory } from '@/core/domain/enums/user-token-category';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { ResetPasswordError } from '@/core/domain/errors/reset-password.error';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { EventBus } from '@/core/ports/services/event-bus';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { factoryUserToken } from '@shared/factory';
import { injectable, inject } from 'inversify';

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

    const payload: ResetPasswordWishedPayload = {
      email,
      username: existingUser.username,
      userToken,
    };

    this.eventBus.emitEvent(
      EventType.RESET_PASSWORD_WISHED_BY_USER,
      JSON.stringify(payload),
    );

    return Ok(userToken.id);
  }
}
