import { CreateUserDto } from '../../core/domain/dto/create-user.dto';
import { User } from '../../core/domain/entities/user.entity';
import { UserUniqKeys } from '../../core/domain/enums/user-uniq-keys.enum';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { pgClient } from '../../infrastructure/persistence/data-source';
import { mapCreateUserDtoToModel } from '../mappers/create-user-dto-to-model';
import { inject, injectable } from 'inversify';
import { mapUserModelToEntity } from '../mappers/user-model-to-entity';
import { Logger } from '../../core/ports/services/logger.service';
import { TYPE } from '../../infrastructure/config/inversify-type';

@injectable()
export class UserRepositoryDb implements UserRepository {
  constructor(@inject(TYPE.Logger) private readonly logger: Logger) {}

  async create(createUserDto: CreateUserDto): Promise<string | null> {
    const userModel = await mapCreateUserDtoToModel(createUserDto);

    const {
      id,
      username,
      first_name,
      last_name,
      email,
      passwd,
      created_at,
      updated_at,
      status,
    } = userModel;

    const insertQuery = {
      text: `
        INSERT INTO users(id, username, email, passwd, created_at, updated_at, status, first_name, last_name)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      values: [
        id,
        username,
        email,
        passwd,
        created_at,
        updated_at,
        status,
        first_name,
        last_name,
      ],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
      return id;
    } catch (error) {
      const errorMessage = `Failed to register user: ${error}`;
      this.logger.error(errorMessage);

      return null;
    }
  }

  async findUserByUniqKey(
    key: UserUniqKeys,
    value: string,
  ): Promise<User | null> {
    const queryUser = {
      text: `SELECT * FROM users WHERE ${key} = $1 LIMIT 1`,
      values: [value],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    const user = result.rows[0];
    if (!user) {
      return null;
    }

    return mapUserModelToEntity(user);
  }
}
