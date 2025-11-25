import { UserImage } from './user-image.entity';
import { User } from './user.entity';
import { Notification } from '../../../notifications/domain/entities/notification.entity';

export type Gender = 'male' | 'female' | 'non-binary';

export type Location = {
  isEnabledByUser: boolean;
  city?: string;
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
  matched: string[];
  notifications: Notification[];
  blocked?: string[];
  reported: boolean;
  age?: number;
};
