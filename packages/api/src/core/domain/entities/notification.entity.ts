export interface Notification {
  id: string;
  author: string;
  fromUser: string;
  category: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
