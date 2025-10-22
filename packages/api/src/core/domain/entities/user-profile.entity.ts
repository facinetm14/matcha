import { User } from './user.entity';

export type Gender = 'male' | 'female' | 'non-binary';

export type sexualOrientation = 'male' | 'female' | 'both';

export type Location = {
 	city: string;
 	lat: number;
 	lng: number;
}

export type UserProfile = User & {
  tags: string[];
  photos: string[];
  profilePhoto: string;
  location?: Location;
  fameRating: number;
  isOnline: boolean;
  lastSeen: Date | null;
  likedBy: string[];
  viewedBy: string[];
  blocked?: string[];
  reported: boolean;
}