import { UserProfile } from '../../../users/domain/entities/user-profile.entity';
import { Message } from './message.entity';

export type Channel = {
  id: string;
  interlocutor: UserProfile;
  messageList: Message[];
  createdAt: Date;
  updatedAt: Date;
};
