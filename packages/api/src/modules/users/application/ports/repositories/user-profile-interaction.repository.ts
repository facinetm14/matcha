import { CreateInteractionDto } from '@/core/domain/dto/create-interaction.dto';
import { UserProfileInteraction } from '@/modules/users/domain/entities/user-profile-interaction.entity';

export interface UserInteractionRepository {
  create(
    createInteractionDto: CreateInteractionDto,
    author: string,
  ): Promise<string | null>;

  delete(
    createInteractionDto: CreateInteractionDto,
    author: string,
  ): Promise<void>;

  findInteraction(
    interaction: Pick<
      UserProfileInteraction,
      'author' | 'recipient' | 'category'
    >,
  ): Promise<UserProfileInteraction | null>;
}
