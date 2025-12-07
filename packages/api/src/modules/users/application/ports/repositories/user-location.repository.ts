import { CreateUserLocationDto } from '../../dto/create-user-location-dto';
import { Location } from '@/modules/users/domain/entities/user-profile.entity';

export interface UserLocationRepository {
  create(createUserLocation: CreateUserLocationDto): Promise<void>;
  update(userId: string, userLocation: Location): Promise<void>;
  findByUserId(userId: string): Promise<string | null>;
}
