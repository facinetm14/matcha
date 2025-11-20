import { Message } from '@/modules/notifications/domain/entities/message.entity';

export interface MessageRepository {
  create(message: Message): Promise<void>;
  findByChannelIdList(channelIdList: string[]): Promise<Message[]>;
}
