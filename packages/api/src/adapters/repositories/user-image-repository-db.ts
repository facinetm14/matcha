import { UserImageRepository } from '@/core/ports/repositories/user-image.repository';
import { Logger } from '@/core/ports/services/logger.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { pgClient } from '@/infrastructure/persistence/data-source';
import { uuid } from '@shared/uuid';
import { inject, injectable } from 'inversify';

@injectable()
export class UserImageRepositoryDb implements UserImageRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async bulkCreate(
    userId: string,
    imageList: { position: number; preview: string }[],
  ): Promise<void> {
    const values: unknown[] = [];
    const valuePlaceholders = imageList
      .map((img, i) => {
        const baseIndex = i * 4;
        const id = uuid();
        values.push(id, userId, img.position, img.preview);
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`;
      })
      .join(', ');

    const insertQuery = {
      text: `
          INSERT INTO user_images (id, user_id, position, preview)
          VALUES ${valuePlaceholders};
        `,
      values,
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to insert user interests: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async delete(userId: string, previewList: string[]): Promise<void> {
    const deleteQuery = {
      text: `DELETE FROM  user_images WHERE user_id = $1 AND preview = ANY($2)`,
      values: [userId, previewList],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(deleteQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to delete user token with userId ${userId} and position ${previewList}: ${error}`,
      );
    }
  }

  async reorderImages(
    userId: string,
    imageList: { preview: string; position: number }[],
  ): Promise<void> {
    const values: unknown[] = [];
    const casesPosition: string[] = [];

    let argIndex = 1;
    imageList.forEach((img) => {
      values.push(img.preview);
      values.push(img.position);
      casesPosition.push(`WHEN preview = $${argIndex} THEN $${argIndex + 1}`);
      argIndex += 2;
    });

    values.push(userId);

    const query = {
      text: `
      UPDATE user_images
      SET position = CASE
        ${casesPosition.join('\n')}
         ELSE position
      END
      WHERE user_id = $${argIndex}
    `,
      values,
    };

    try {
      const connection = await pgClient.connect();
      await connection.query(query);
      connection.release();
    } catch (error) {
      const errorMessage = `Failed to update user image positions: ${error}`;
      this.logger.error(errorMessage);
    }
  }
}
