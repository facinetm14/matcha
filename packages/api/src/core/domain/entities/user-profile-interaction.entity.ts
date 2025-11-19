export type InteractionCategory =
  | 'like'
  | 'unlike'
  | 'swipe'
  | 'block'
  | 'unblock'
  | 'view'
  | 'report'
  | 'match';

export interface UserProfileInteraction {
  id: string;
  author: string;
  recipient: string;
  category: InteractionCategory;
  createdAt: Date;
  updatedAt: Date;
}
