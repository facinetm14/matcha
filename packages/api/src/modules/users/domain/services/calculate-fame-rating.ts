import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';

const LIKE_WEIGHT = 2;
const VIEW_WEIGHT = 1;
const DEFAULT_RATE = 1;
const MAX_RATE = 1000;

export function calculateFameRating(user: UserProfile): number {
  const fameRating = Math.floor(
    user.likedBy.length / LIKE_WEIGHT + user.viewedBy.length / VIEW_WEIGHT,
  );

  if (fameRating < DEFAULT_RATE) {
    return 1;
  }

  return fameRating < MAX_RATE ? fameRating : MAX_RATE;
}
