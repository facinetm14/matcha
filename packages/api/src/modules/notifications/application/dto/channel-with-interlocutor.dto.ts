import { Channel } from '@/modules/notifications/domain/entities/channel.entity';
import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';

export type ChannelWithInterlocutorDto = Omit<Channel, 'interlocutorId'> & {
  interlocutor: UserProfile;
};
