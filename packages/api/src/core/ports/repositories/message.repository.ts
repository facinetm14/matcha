import { Message } from '@/core/domain/entities/message.entity';

export interface MessageRepository {
  create(message: Message): Promise<void>;
  findByChannelIdList(channelIdList: string[]): Promise<Message[]>;
}
