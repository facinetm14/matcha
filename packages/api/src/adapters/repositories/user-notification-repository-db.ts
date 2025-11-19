import { UserNotificationRepository } from '@/core/ports/repositories/user-notification.repository';
import { Logger } from '@/core/ports/services/logger.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { pgClient } from '@/infrastructure/persistence/data-source';
import { injectable, inject } from 'inversify';
import { Notification } from '@/core/domain/entities/notification.entity';

@injectable()
export class UserNotificationRepositoryDb
  implements UserNotificationRepository
{
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async create(createNotification: Notification): Promise<void> {
    const { id, author, fromUser, isRead, createdAt, updatedAt, category } =
      createNotification;

    const insertQuery = {
      text: `
            INSERT INTO user_notifications(id, author, from_user, is_read, created_at, updated_at, category)
            VALUES($1, $2, $3, $4, $5, $6, $7)
          `,
      values: [
        id,
        author,
        fromUser,
        isRead ? 'yes' : null,
        createdAt,
        updatedAt,
        category,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to insert user interaction ${createNotification}: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async findMatchByUserId(userId: string): Promise<Notification[]> {
    const query = {
      text: `
            SELECT * FROM user_notifications WHERE category = 'match' AND (
              author = $1
              OR
              from_user = $1
            )
          `,
      values: [userId],
    };

    try {
      const connexion = await pgClient.connect();
      const matchResp = await pgClient.query(query);
      connexion.release();

      return matchResp.rows.map((m) => {
        const match: Notification = {
          id: m.id,
          author: m.author,
          fromUser: m.from_user,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
          category: m.category,
          isRead: m.is_read ? true : false,
        };

        return match;
      });
    } catch (error) {
      const errorMessage = `Failed while fetch user match ${userId}: ${error}`;
      this.logger.error(errorMessage);
      return [];
    }
  }
}
