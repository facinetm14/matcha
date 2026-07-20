import { InteractionCategory } from '@/modules/users/domain/entities/user-profile-interaction.entity';

export interface CreateInteractionDto {
  recipient: string;
  category: InteractionCategory;
}
