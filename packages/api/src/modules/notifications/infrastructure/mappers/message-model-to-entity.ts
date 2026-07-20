import { Message } from '@/modules/notifications/domain/entities/message.entity';
import { MessageModel } from '../models/message.model';

export function mapMessageModelToEntity(messageModel: MessageModel): Message {
  return {
    id: messageModel.id,
    channelId: messageModel.channel_id,
    senderId: messageModel.sender_id,
    content: messageModel.content,
    isRead: Boolean(messageModel.is_read),
    createdAt: messageModel.created_at,
    updatedAt: messageModel.updated_at,
  };
}
