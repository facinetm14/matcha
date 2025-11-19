export type InteractionCategory =
  | 'like'
  | 'unlike'
  | 'block'
  | 'unblock'
  | 'swipe'
  | 'view'
  | 'report';

export interface CreateInteractionDto {
  recipient: string;
  category: InteractionCategory;
}
