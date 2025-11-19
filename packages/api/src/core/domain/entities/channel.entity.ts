import { Message } from "./message.entity";
import { UserProfile } from "./user-profile.entity";

export type Channel = {
  id: string;
  interlocutor: UserProfile;
  messageList: Message[];
  createdAt: Date;
  updatedAt: Date;
};
