// Domain layer - entities and value objects
export type { User } from './entities/user.entity';
export type {
  UserProfile,
  Location,
  Gender,
} from './entities/user-profile.entity';
export type { UserImage } from './entities/user-image.entity';
export type { UserInterest } from './entities/user-interest.entity';
export type {
  UserProfileInteraction,
  InteractionCategory,
} from './entities/user-profile-interaction.entity';
export { UserStatus } from './consts/user-status.enum';

// Domain services
export { calculateFameRating } from './services/calculate-fame-rating';
export { calculateAge } from './services/calculate-age';
