import { pgClient } from '@/config/db/data-source';
import { TYPE } from '@/config/ioc/inversify-type';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { CreateUserLocationDto } from '@/modules/users/application/dto/create-user-location-dto';
import { UserLocationRepository } from '@/modules/users/application/ports/repositories/user-location.repository';
import { GeocodeService } from '@/modules/users/application/ports/services/geo-code-service';
import { Location } from '@/modules/users/domain/entities/user-profile.entity';
import { extractCityFromGeocode } from '@shared/extract-city-from-geocode';
import { inject, injectable } from 'inversify';

@injectable()
export class UserLocationRepositoryDb implements UserLocationRepository {
  constructor(
    @inject(TYPE.Logger) private readonly logger: Logger,
    @inject(TYPE.GeocodeService)
    private readonly geocodeService: GeocodeService,
  ) {}

  async create(createUserLocation: CreateUserLocationDto): Promise<void> {
    const { id, userId, isEnabledByUser, lat, lng } = createUserLocation;
    const now = new Date();

    const geocodeData = await this.geocodeService.getGeocode(lat, lng);

    const city = geocodeData
      ? extractCityFromGeocode(geocodeData.address)
      : undefined;

    const insertQuery = {
      text: `
                INSERT INTO users_location(id, user_id, shared_by_user_at, lat, lng, city)
                VALUES($1, $2, $3, $4, $5, $6)
              `,
      values: [id, userId, isEnabledByUser ? now : null, lat, lng, city],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to insert user location ${createUserLocation}: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async update(userId: string, userLocation: Location): Promise<void> {
    const { isEnabledByUser, lat, lng } = userLocation;
    const now = new Date();

    const geocodeData = await this.geocodeService.getGeocode(lat, lng);

    const city = geocodeData
      ? extractCityFromGeocode(geocodeData.address)
      : undefined;

    const insertQuery = {
      text: `UPDATE users_location
              SET shared_by_user_at=$1, lat=$2, lng=$3, city=$4
            WHERE user_id=$5`,
      values: [isEnabledByUser ? now : null, lat, lng, city, userId],
    };

    try {
      const connexion = await pgClient.connect();
      await pgClient.query(insertQuery);
      connexion.release();
    } catch (error) {
      const errorMessage = `Failed to update user location ${userLocation}: ${error}`;
      this.logger.error(errorMessage);
    }
  }

  async findByUserId(userId: string): Promise<string | null> {
    const queryUserLocation = {
      text: `SELECT id FROM users_location WHERE user_id = $1 LIMIT 1`,
      values: [userId],
    };

    const connexion = await pgClient.connect();
    const result = await pgClient.query(queryUserLocation);
    connexion.release();
    const userLocation = result.rows[0];
    if (!userLocation) {
      return null;
    }

    return userLocation.id;
  }
}
