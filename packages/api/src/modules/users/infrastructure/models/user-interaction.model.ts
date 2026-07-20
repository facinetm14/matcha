import { InteractionCategory } from '@/modules/shared/domain/interaction-category';

export interface UserInteractionModel {
  id: string;
  author: string;
  recipient: string;
  category: InteractionCategory;
  created_at: Date;
  updated_at: Date;
}
