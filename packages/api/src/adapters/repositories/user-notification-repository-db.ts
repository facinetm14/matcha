import { Notification } from '@/core/domain/entities/notification.entity';
import { UserNotificationRepository } from '@/core/ports/repositories/user-notification.repository';
import { Logger } from '@/core/ports/services/logger.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { pgClient } from '@/infrastructure/persistence/data-source';
import { injectable, inject } from 'inversify';

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
}
