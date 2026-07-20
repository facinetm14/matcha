import { InteractionCategory } from '@/modules/shared/domain/interaction-category';

export interface CreateInteractionDto {
  recipient: string;
  category: InteractionCategory;
}
