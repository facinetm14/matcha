import { InteractionCategory } from "@/core/domain/entities/user-profile-interaction.entity";

export interface UserInteractionModel {
  id: string;
  author: string;
  recipient: string;
  category: InteractionCategory;
  created_at: Date;
  updated_at: Date;
}
