import { InteractionCategory } from "@/modules/users/domain/entities/user-profile-interaction.entity";

export interface Notification {
  id: string;
  author: string;
  fromUser: string;
  category: InteractionCategory;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
