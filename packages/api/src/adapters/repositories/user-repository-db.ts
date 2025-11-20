import { CreateUserDto } from '../../core/domain/dto/create-user.dto';
import { User } from '../../core/domain/entities/user.entity';
import { UserUniqKeys } from '../../core/domain/enums/user-uniq-keys.enum';
import { UserRepository } from '../../core/ports/repositories/user.repository';
import { pgClient } from '../../infrastructure/persistence/data-source';
import { inject, injectable } from 'inversify';
import { UserProfile } from '@/core/domain/entities/user-profile.entity';

import {
  buildUserProfileFromUserAggregate,
  mapUserModelToEntity,
} from '../mappers/user-model-to-entity';
import { Logger } from '../../core/ports/services/logger.service';
import { TYPE } from '../../infrastructure/config/inversify-type';
import { mapEnityOrDtoToModel } from '../mappers/map-entity-or-dto-to-model';
import { UserModel } from '../../infrastructure/persistence/models/user.model';
import { UpdateUserDto } from '../../core/domain/dto/update-user.dto';
import { CacheService } from '@/core/ports/services/cache.service';
import { CacheResourceKeys } from '@/core/domain/consts/cache-resource-keys';

@injectable()
export class UserRepositoryDb implements UserRepository {
  constructor(
    @inject(TYPE.Logger) private readonly logger: Logger,
    @inject(TYPE.CacheService) private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string | null> {
    const userModel = mapEnityOrDtoToModel<CreateUserDto, UserModel>(
      createUserDto,
    );

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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const updateUser = mapEnityOrDtoToModel<UpdateUserDto, UserModel>(
      updateUserDto,
    );

    let columns = '';
    const columnsValues = [];

    let index = 1;

    for (const [colum, value] of Object.entries(updateUser)) {
      columns += `${index > 1 ? ',' : ''} ${colum}=$${index}`;
      columnsValues.push(value);
      index += 1;
    }

    const updateQuery = {
      text: `UPDATE users SET ${columns} WHERE id=$${index}`,
      values: [...columnsValues, id],
    };

    const connexion = await pgClient.connect();
    try {
      await pgClient.query(updateQuery);
    } catch (error) {
      this.logger.error(`Error: unable to update user ${id}, ${error}`);
    }
    connexion.release();

    return this.findUserByUniqKey(UserUniqKeys.ID, id);
  }

  async findUserProfileById(id: string): Promise<UserProfile | null> {
    const queryUser = {
      text: `
              SELECT u.*, 
              uim.id as img_id, uim.position as img_position, uim.preview as img_preview,
              ui.interest,
              upi.author, upi.category, upi.created_at as interaction_created_at ,
              notif.id as notif_id, notif.author as notif_author, notif.from_user as notif_from_user,
              notif.created_at as notif_created_at, notif.updated_at as notif_updated_at, notif.is_read as notif_is_read,
              notif.category as notif_category
              FROM users as u
              LEFT JOIN user_images as uim ON u.id = uim.user_id
              LEFT JOIN user_interests as ui ON u.id = ui.user_id 
              LEFT JOIN user_profile_interactions as upi ON upi.recipient = u.id
              LEFT JOIN user_notifications as notif ON (
                (notif.author = u.id AND notif.category != $2)
                 OR 
                (notif.category = $2 AND (notif.author = u.id OR notif.from_user = u.id))
              )
              WHERE u.id = $1
              ORDER BY interaction_created_at DESC
            `,
      values: [id, 'match'],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    const userProfileRawList = result.rows;
    if (!userProfileRawList.length) {
      return null;
    }

    const userProfileRawListWithOnlineStatus = [];
    for (const user of userProfileRawList) {
      const isOnline = await this.getOnlineStatus(user.id);
      const lastSeen = await this.getLastConnection(user.id);
      userProfileRawListWithOnlineStatus.push({ ...user, isOnline, lastSeen });
    }

    const userProfiles = buildUserProfileFromUserAggregate(
      userProfileRawListWithOnlineStatus,
    );
    return userProfiles[0];
  }

  async findUserProfileByIdList(id: string[]): Promise<UserProfile[]> {
    const queryUser = {
      text: `
              SELECT u.*, 
              uim.id as img_id, uim.position as img_position, uim.preview as img_preview,
              ui.interest,
              upi.author, upi.category, upi.created_at as interaction_created_at ,
              notif.id as notif_id, notif.author as notif_author, notif.from_user as notif_from_user,
              notif.created_at as notif_created_at, notif.updated_at as notif_updated_at, notif.is_read as notif_is_read,
              notif.category as notif_category
              FROM users as u
              LEFT JOIN user_images as uim ON u.id = uim.user_id
              LEFT JOIN user_interests as ui ON u.id = ui.user_id 
              LEFT JOIN user_profile_interactions as upi ON upi.recipient = u.id
              LEFT JOIN user_notifications as notif ON (
                (notif.author = u.id AND notif.category != $2)
                 OR 
                (notif.category = $2 AND (notif.author = u.id OR notif.from_user = u.id))
              )
              WHERE u.id = ANY($1)
              ORDER BY interaction_created_at DESC
            `,
      values: [id, 'match'],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUser);
    connexion.release();
    const userProfileRawList = result.rows;
    if (!userProfileRawList.length) {
      return [];
    }

    const userProfileRawListWithOnlineStatus = [];
    for (const user of userProfileRawList) {
      const isOnline = await this.getOnlineStatus(user.id);
      const lastSeen = await this.getLastConnection(user.id);
      userProfileRawListWithOnlineStatus.push({ ...user, isOnline, lastSeen });
    }

    const userProfiles = buildUserProfileFromUserAggregate(
      userProfileRawListWithOnlineStatus,
    );
    return userProfiles;
  }

  private async getOnlineStatus(userId: string): Promise<boolean> {
    const isConnectedUser = await this.cacheService.findById(
      CacheResourceKeys.CONNECTED_USERS,
      userId,
    );
    return !!isConnectedUser;
  }

  private async getLastConnection(userId: string): Promise<Date | null> {
    const lastConnection = await this.cacheService.findById<{
      id: string;
      lastSeen: Date;
    }>(CacheResourceKeys.LAST_CONNEXION, userId);

    if (!lastConnection) {
      return null;
    }

    return lastConnection.lastSeen;
  }
}
