import { Message } from './message.entity';

export type Channel = {
  id: string;
  interlocutorId: string;
  messageList: Message[];
  createdAt: Date;
  updatedAt: Date;
};
