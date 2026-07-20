// Infrastructure layer - adapters, repositories, services, mappers, models
export { UserRepositoryDb } from './adapters/repositories/user-repository-db';
export { UserRepositoryInMemory } from './adapters/repositories/user-repository-InMemory';
export { UserInterestRepositoryDb } from './adapters/repositories/user-interest-repository-db';
export { UserInteractionRepositoryDb } from './adapters/repositories/user-profile-interaction-repository-db';
export { UserImageRepositoryDb } from './adapters/repositories/user-image-repository-db';
export { UserLocationRepositoryDb } from './adapters/repositories/user-location-repository-db';
export { GeocodeOpenStreetMap } from './adapters/services/geocode-openstreetmap';

// Models
export type { UserModel } from './models/user.model';
export type { UserInterestModel } from './models/user-interest.model';
export type { UserInteractionModel } from './models/user-interaction.model';

// Mappers
export {
  mapUserModelToEntity,
  buildUserProfileFromUserAggregate,
  buildCity,
} from './mappers/user-model-to-entity';
export type { UserAggregate } from './mappers/user-model-to-entity';
export { mapUserInterestModelToEntity } from './mappers/map-user-interest-model-to-entity';
