import { inject, injectable } from 'inversify';
import { CreateMessageDto } from '../dto/create-messag.dto';
import { TYPE } from '@/config/ioc/inversify-type';
import { MessageRepository } from '../ports/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';
import { uuid } from '@shared/uuid';
import { UserNotificationRepository } from '../ports/repositories/user-notification.repository';
import { Notification } from '../../domain/entities/notification.entity';
import { EventBus } from '@/modules/shared/application/ports/services/event-bus';
import { EventType } from '@/modules/shared/application/consts/event-type';

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject(TYPE.MessageRepository)
    private readonly messageRepository: MessageRepository,
    @inject(TYPE.UserNotificationRepository)
    private readonly userNotificationRepository: UserNotificationRepository,
    @inject(TYPE.EventBus) private readonly eventBus: EventBus,
  ) {}

  async execute(createMessage: CreateMessageDto): Promise<string | undefined> {
    const channel = await this.userNotificationRepository.findMatchById(
      createMessage.channelId,
    );
    if (!channel) {
      return;
    }

    if (
      createMessage.senderId !== channel.author &&
      createMessage.senderId !== channel.fromUser
    ) {
      return;
    }

    const now = new Date();
    const newMessage: Message = {
      id: uuid(),
      senderId: createMessage.senderId,
      content: createMessage.content,
      channelId: createMessage.channelId,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.messageRepository.create(newMessage);

    const interlocutor =
      channel.author === createMessage.senderId
        ? channel.fromUser
        : channel.author;

    const notification: Notification = {
      id: `${uuid()}-msg-${createMessage.channelId}`,
      author: interlocutor,
      fromUser: newMessage.senderId,
      category: 'message',
      createdAt: now,
      updatedAt: now,
      isRead: false,
    };

    this.eventBus.publish(
      EventType.USER_INTERACTION_ADDED,
      JSON.stringify(notification),
    );

    return interlocutor;
  }
}
