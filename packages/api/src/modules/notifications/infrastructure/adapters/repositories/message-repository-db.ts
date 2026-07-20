import { Message } from '@/modules/notifications/domain/entities/message.entity';
import { MessageRepository } from '@/modules/notifications/application/ports/repositories/message.repository';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { pgClient } from '@/config/db/data-source';
import { injectable, inject } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class MessageRepositoryDb implements MessageRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}
  async create(message: Message): Promise<void> {
    const { id, senderId, channelId, isRead, createdAt, content, updatedAt } =
      message;

    const insertQuery = {
      text: `
                INSERT INTO messages(id, channel_id, sender_id, is_read, content, created_at, updated_at)
                VALUES($1, $2, $3, $4, $5, $6, $7)
              `,
      values: [
        id,
        channelId,
        senderId,
        isRead ? 'yes' : null,
        content,
        createdAt,
        updatedAt,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to insert message ${message}: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async findByChannelIdList(channeIdList: string[]): Promise<Message[]> {
    const query = {
      text: `SELECT * FROM messages WHERE channel_id = ANY($1)`,
      values: [channeIdList],
    };

    try {
      const connexion = await pgClient.connect();
      const messageResp = await pgClient.query(query);
      connexion.release();

      return messageResp.rows.map((m) => {
        const message: Message = {
          id: m.id,
          channelId: m.channel_id,
          content: m.content,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
          isRead: m.is_read ? true : false,
          senderId: m.sender_id,
        };

        return message;
      });
    } catch (error) {
      const errorMessage = `Failed while fetching message from channel ${channeIdList}: ${error}`;
      this.logger.error(errorMessage);
      return [];
    }
  }
}
