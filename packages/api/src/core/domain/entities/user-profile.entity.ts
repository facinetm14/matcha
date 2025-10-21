import { User } from './user.entity';

export type UserProfile = {
  user: User;
  profilePictureUrl?: string;
  picturesUrls?: string[];
}