import { UserProfileInteraction } from '@/modules/users/domain/entities/user-profile-interaction.entity';
import { UserInteractionRepository } from '@/modules/users/application/ports/repositories/user-profile-interaction.repository';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { pgClient } from '@/config/db/data-source';
import { UserInteractionModel } from '@/modules/users/infrastructure/models/user-interaction.model';
import { uuid } from '@shared/uuid';
import { injectable, inject } from 'inversify';
import { CreateInteractionDto } from '@/modules/users/application/dto/create-user-interaction.dto';
import { TYPE } from '@/config/ioc/inversify-type';

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

  async delete(
    createInteractionDto: CreateInteractionDto,
    author: string,
  ): Promise<void> {
    const deleteQuery = {
      text: `DELETE FROM user_profile_interactions WHERE author = $1 AND recipient = $2 AND category = $3`,
      values: [
        author,
        createInteractionDto.recipient,
        createInteractionDto.category,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(deleteQuery);
      connexion.release();
    } catch (error) {
      this.logger.error(
        `Failed to delete user ${author} interaction with id ${createInteractionDto.recipient} and category ${createInteractionDto.category}: ${error}`,
      );
    }
  }

  async findInteraction(
    interaction: Pick<
      UserProfileInteraction,
      'author' | 'recipient' | 'category'
    >,
  ): Promise<UserProfileInteraction | null> {
    const query = {
      text: `SELECT * FROM user_profile_interactions WHERE author = $1 AND recipient = $2 AND category = $3 ORDER BY created_at DESC LIMIT 1`,
      values: [interaction.author, interaction.recipient, interaction.category],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(query);
    connexion.release();
    const interactionModel = result.rows[0];
    if (!interactionModel) {
      return null;
    }

    return {
      id: interactionModel.id,
      author: interactionModel.author,
      recipient: interactionModel.recipient,
      category: interactionModel.category,
      createdAt: interactionModel.created_at,
      updatedAt: interactionModel.updated_at,
    };
  }
}
