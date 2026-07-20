import { UserInterest } from '@/modules/users/domain/entities/user-interest.entity';
import { UserInterestColumns } from '@/modules/users/application/consts/user-interest-columns.enum';
import { UserInterestRepository } from '@/modules/users/application/ports/repositories/user-interest.repository';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { pgClient } from '@/config/db/data-source';
import { injectable, inject } from 'inversify';
import { mapUserInterestModelToEntity } from '../../mappers/map-user-interest-model-to-entity';
import { UserInterestModel } from '@/modules/users/infrastructure/models/user-interest.model';
import { uuid } from '@shared/uuid';
import { TYPE } from '@/config/ioc/inversify-type';

@injectable()
export class UserInterestRepositoryDb implements UserInterestRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async bulkCreate(userId: string, interests: string[]): Promise<void> {
    if (interests.length === 0) return;

    const values: unknown[] = [];
    const valuePlaceholders = interests
      .map((interest, i) => {
        const baseIndex = i * 3;
        const id = uuid();
        values.push(id, userId, interest);
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
      })
      .join(', ');

    const insertQuery = {
      text: `
      INSERT INTO user_interests (id, user_id, interest)
      VALUES ${valuePlaceholders}
      ON CONFLICT (user_id, interest) DO NOTHING;
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

  async findAllByColumn(
    column: UserInterestColumns,
    value: string,
  ): Promise<UserInterest[]> {
    const queryUserInterest = {
      text: `SELECT * FROM user_interests WHERE ${column} = $1`,
      values: [value],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserInterest);
    connexion.release();

    const userInterestRawList = result.rows as UserInterestModel[];
    return userInterestRawList.map((userInterest) =>
      mapUserInterestModelToEntity(userInterest),
    );
  }

  async findAll(): Promise<string[]> {
    const queryUserInterest = {
      text: `SELECT DISTINCT interest FROM user_interests ORDER BY interest`,
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserInterest);
    connexion.release();

    const userInterestRawList = result.rows as UserInterestModel[];
    return userInterestRawList.map((userInterest) => userInterest.interest);
  }

  async deleteByUserId(userId: string): Promise<void> {
    const deleteQuery = {
      text: `DELETE FROM user_interests WHERE user_id = $1`,
      values: [userId],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(deleteQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to delete user interest with id ${userId}: ${error}`,
      );
    }
  }
}
