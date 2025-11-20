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

  async findMatchById(id: string): Promise<Notification | null> {
    const query = {
      text: `
            SELECT * FROM user_notifications WHERE category = 'match' AND id = $1
          `,
      values: [id],
    };

    try {
      const connexion = await pgClient.connect();
      const matchResp = await pgClient.query(query);
      connexion.release();

      const matchRaw = matchResp.rows[0];

      if (!matchRaw) {
        return null;
      }

      return {
        id: matchRaw.id,
        author: matchRaw.author,
        fromUser: matchRaw.from_user,
        createdAt: matchRaw.created_at,
        updatedAt: matchRaw.updated_at,
        category: matchRaw.category,
        isRead: matchRaw.is_read ? true : false,
      };
    } catch (error) {
      const errorMessage = `Failed while fetch user match ${id}: ${error}`;
      this.logger.error(errorMessage);
      return null;
    }
  }

  async deleteMatch(author: string, fromUser: string): Promise<void> {
    const deleteQuery = {
      text: `DELETE FROM user_notifications WHERE category = $2 AND 
      author = ANY($1) AND from_user = ANY($1)`,
      values: [[author, fromUser], 'match'],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(deleteQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to delete ${[author, fromUser]} match ${error}`,
      );
    }
  }
}
