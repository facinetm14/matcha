import { ChannelWithInterlocutorDto } from '@/modules/notifications/application/dto/channel-with-interlocutor.dto';
import { MessageRepository } from '@/modules/notifications/application/ports/repositories/message.repository';
import { UserNotificationRepository } from '@/modules/notifications/application/ports/repositories/user-notification.repository';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { injectable, inject } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class GetUserChannelsUseCase {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPE.UserNotificationRepository)
    private readonly userNotificationRepository: UserNotificationRepository,
    @inject(TYPE.MessageRepository)
    private readonly messageRepository: MessageRepository,
  ) {}
  async execute(userId: string) {
    const matchList =
      await this.userNotificationRepository.findMatchByUserId(userId);

    const channelMap = new Map<string, ChannelWithInterlocutorDto>();
    const channelIdList: string[] = [];

    for (const m of matchList) {
      channelIdList.push(m.id);

      if (channelMap.has(m.id)) {
        continue;
      }

      const interlocutorId = m.author === userId ? m.fromUser : m.author;
      const matchedUser =
        await this.userRepository.findUserProfileById(interlocutorId);

      const newChannel: ChannelWithInterlocutorDto = {
        id: m.id,
        interlocutor: matchedUser!,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        messageList: [],
      };

      channelMap.set(newChannel.id, newChannel);
    }

    const messageList =
      await this.messageRepository.findByChannelIdList(channelIdList);

    for (const message of messageList) {
      const messageChannel = channelMap.get(message.channelId);
      if (!messageChannel) {
        continue;
      }

      messageChannel.messageList.push(message);
    }

    return [...channelMap.values()];
  }
}
