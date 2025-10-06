import { UserInterestColumns } from '@/core/domain/enums/user-interest-columns.enum';
import { UserInterestRepository } from '@/core/ports/repositories/user-interest.repository';
import { Logger } from '@/core/ports/services/logger.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { pgClient } from '@/infrastructure/persistence/data-source';
import { injectable, inject } from 'inversify';

@injectable()
export class UserInterestRepositoryDb implements UserInterestRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async create(id: string, userId: string, interest: string): Promise<void> {
    const insertQuery = {
      text: `
          INSERT INTO user_interests(id, user_id, interest)
          VALUES($1, $2, $3);`,
      values: [id, userId, interest],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to register user: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async findAllByColumn(
    column: UserInterestColumns,
    value: string,
  ): Promise<string[]> {
    const queryUser = {
      text: `SELECT interest FROM user_interests WHERE ${column} = $1 LIMIT 1`,
      values: [value],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    return result.rows as string[];
  }
}
