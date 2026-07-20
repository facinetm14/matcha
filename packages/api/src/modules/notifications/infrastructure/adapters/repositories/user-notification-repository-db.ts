import { UserNotificationRepository } from '@/modules/notifications/application/ports/repositories/user-notification.repository';
import { Logger } from '@/modules/shared/ports/logger.service';
import { pgClient } from '@/config/db/data-source';
import { injectable, inject } from 'inversify';
import { Notification } from '@/modules/notifications/domain/entities/notification.entity';
import { TYPE } from '@/config/ioc/inversify-type';
import { mapUserNotificationModelToEntity } from '../../mappers/user-notification-model-to-entity';
import { UserNotificationModel } from '../../models/user-notification.model';

@injectable()
export class UserNotificationRepositoryDb implements UserNotificationRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async create(createAppNotification: Notification): Promise<void> {
    const { id, author, fromUser, isRead, createdAt, updatedAt, category } =
      createAppNotification;

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
      const errorMessage = `Failed to insert user interaction ${createAppNotification}: ${error}`;
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

      return (matchResp.rows as UserNotificationModel[]).map((matchRaw) =>
        mapUserNotificationModelToEntity(matchRaw),
      );
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

      const matchRaw = matchResp.rows[0] as UserNotificationModel | undefined;

      if (!matchRaw) {
        return null;
      }

      return mapUserNotificationModelToEntity(matchRaw);
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

  async updateReadStatusById(id: string): Promise<void> {
    const updateQuery = {
      text: `UPDATE user_notifications SET is_read = $1 WHERE id=$2`,
      values: ['yes', id],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(updateQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${id} read status ${error}`,
      );
    }
  }

  async updateReadStatusByAuthorAndFromUser(
    author: string,
    fromUser: string,
  ): Promise<void> {
    const updateQuery = {
      text: `UPDATE user_notifications SET is_read = $1 WHERE category = $2 AND 
      (
        author = $3
        AND
        from_user = $4
      ) `,
      values: ['yes', 'message', author, fromUser],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(updateQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${{ author, fromUser }} read status ${error}`,
      );
    }
  }
}
