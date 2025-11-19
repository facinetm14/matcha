import { UserImage } from './user-image.entity';
import { User } from './user.entity';
import { Notification } from './notification.entity';

export type Gender = 'male' | 'female' | 'non-binary';

export type sexualOrientation = 'male' | 'female' | 'both';

export type Location = {
  city: string;
  lat: number;
  lng: number;
};

export type UserProfile = User & {
  tags: string[];
  photos: UserImage[];
  location?: Location;
  fameRating: number;
  isOnline: boolean;
  lastSeen: Date | null;
  likedBy: string[];
  viewedBy: string[];
  notifications: Notification[];
  blocked?: string[];
  reported: boolean;
};
