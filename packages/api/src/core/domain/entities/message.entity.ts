export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}