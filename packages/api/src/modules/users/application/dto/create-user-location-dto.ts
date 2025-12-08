import { Location } from '../../domain/entities/user-profile.entity';

export type CreateUserLocationDto = Location & {
  id: string;
  userId: string;
};
