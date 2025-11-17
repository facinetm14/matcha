type InteractionCategory =
  | 'like'
  | 'unlike'
  | 'swipe'
  | 'block'
  | 'unblock'
  | 'view'
  | 'report';

export interface CreateInteractionDto {
  recipient: string;
  category: InteractionCategory;
}
