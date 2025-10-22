import { CreateInteractionDto } from '@/core/domain/dto/create-interaction.dto';
import { UserInteractionRepository } from '@/core/ports/repositories/user-profile-interaction.repository';
import { Logger } from '@/core/ports/services/logger.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { pgClient } from '@/infrastructure/persistence/data-source';
import { UserInteractionModel } from '@/infrastructure/persistence/models/user-interaction.model';
import { uuid } from '@shared/uuid';
import { injectable, inject } from 'inversify';

@injectable()
export class UserInteractionRepositoryDb implements UserInteractionRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async create(
    createInteractionDto: CreateInteractionDto,
    author: string,
  ): Promise<string | null> {
    const now = new Date();

    const newInteraction: UserInteractionModel = {
      id: uuid(),
      author,
      recipient: createInteractionDto.recipient,
      category: createInteractionDto.category,
      created_at: now,
      updated_at: now,
    };

    const { id, recipient, category, created_at, updated_at } = newInteraction;

    const insertQuery = {
      text: `
        INSERT INTO user_profile_interactions(id, author, recipient, category, created_at, updated_at)
        VALUES($1, $2, $3, $4, $5, $6)
      `,
      values: [id, author, recipient, category, created_at, updated_at],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
      return id;
    } catch (error) {
      const errorMessage = `Failed to insert user interaction ${newInteraction}: ${error}`;
      this.logger.error(errorMessage);
      return null;
    }
  }
}
