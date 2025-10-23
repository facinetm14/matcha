import { CreateInteractionDto } from '@/core/domain/dto/create-interaction.dto';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { Err, Ok, Result } from '@/core/domain/utils/result';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { UserRepository } from '@/core/ports/repositories/user.repository';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { inject, injectable } from 'inversify';

/**
 * TODO send notification to recipient user
 */

export type AddUserInteractionError =
  | 'author_not_found'
  | 'recipient_not_found'
  | 'unknow_error'
  | 'unauthorized';

@injectable()
export class AddUserInteractionUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserInteractionRepository)
    private readonly userInteractionRepository: UserInteractionRepository,
  ) {}

  async execute(
    createInteractionDto: CreateInteractionDto,
    userId: string,
  ): Promise<Result<null, AddUserInteractionError>> {
    const author = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      userId,
    );
    if (!author) {
      return Err('author_not_found');
    }

    const recipientUser = await this.userRepository.findUserByUniqKey(
      UserUniqKeys.ID,
      createInteractionDto.recipient,
    );

    if (!recipientUser) {
      return Err('recipient_not_found');
    }

    const newInteraction = await this.userInteractionRepository.create(
      createInteractionDto,
      userId,
    );

    if (!newInteraction) {
      return Err('unknow_error');
    }

    return Ok(null);
  }
}
