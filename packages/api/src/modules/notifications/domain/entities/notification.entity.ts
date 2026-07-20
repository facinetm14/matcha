import { InteractionCategory } from '@/modules/shared/domain/interaction-category';

export interface Notification {
  id: string;
  author: string;
  fromUser: string;
  category: InteractionCategory;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
