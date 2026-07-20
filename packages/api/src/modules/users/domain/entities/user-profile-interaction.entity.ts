import { InteractionCategory as SharedInteractionCategory } from '@/modules/shared/domain/interaction-category';

export type InteractionCategory = SharedInteractionCategory;

export interface UserProfileInteraction {
  id: string;
  author: string;
  recipient: string;
  category: InteractionCategory;
  createdAt: Date;
  updatedAt: Date;
}
