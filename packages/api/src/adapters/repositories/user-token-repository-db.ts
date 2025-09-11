import { UserToken } from '../../core/domain/entities/user-token.entity';
import { UserTokenRepository } from '../../core/ports/repositories/user-token.repository';
import { inject, injectable } from 'inversify';
import { pgClient } from '../../infrastructure/persistence/data-source';
import { Logger } from '../../core/ports/services/logger.service';
import { TYPE } from '../../infrastructure/config/inversify-type';
import { mapUserTokenModelToEntity } from '../mappers/user-token-model-to-entity';
import { mapEnityOrDtoToModel } from '../mappers/map-entity-or-dto-to-model';
import { UserTokenModel } from '../../infrastructure/persistence/models/user-token.model';

@injectable()
export class UserTokenRepositoryDb implements UserTokenRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}
  async create(createUserToken: UserToken): Promise<string | null> {
    const userToken = mapEnityOrDtoToModel<UserToken, UserTokenModel>(
      createUserToken,
    );

    const {
      id,
      user_id,
      category,
      token,
      created_at,
      updated_at,
      ip_addr,
      device,
      expire_at,
    } = userToken;

    const insertQuery = {
      text: `
        INSERT INTO users_tokens(id, user_id, category, token, created_at, updated_at, ip_addr, device, expire_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      values: [
        id,
        user_id,
        category,
        token,
        created_at,
        updated_at,
        ip_addr,
        device,
        expire_at,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();

      return id;
    } catch (error) {
      const errorMessage = `Failed to insert user token ${userToken}: ${error}`;
      this.logger.error(errorMessage);
      return null;
    }
  }

  async findByToken(token: string): Promise<UserToken | null> {
    const queryUserToken = {
      text: `SELECT * FROM users_tokens WHERE token = $1 LIMIT 1`,
      values: [token],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserToken);
    connexion.release();
    const userToken = result.rows[0];
    if (!userToken) {
      return null;
    }

    return mapUserTokenModelToEntity(userToken);
  }

  async delete(id: string): Promise<void> {
    const queryUserToken = {
      text: `DELETE FROM users_tokens WHERE id = $1`,
      values: [id],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(queryUserToken);
      connexion.release();
    } catch (error) {
      this.logger.error(`Failed to delete user token with id ${id}: ${error}`);
    }
  }
}
