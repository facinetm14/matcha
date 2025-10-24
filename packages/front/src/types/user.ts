import { UserImage } from "./user-image";

export enum UserStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  status: UserStatus;
  isFirstLogin: string | null;
  gender?: Gender;
  sexualOrientation?: Gender[];
  bio?: string;
  age?: number;
  tags?: string[];
  photos?: UserImage[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Gender = 'male' | 'female' | 'non-binary';

export type sexualOrientation = 'male' | 'female' | 'both';

export type Location = {
  city: string;
  lat: number;
  lng: number;
};

export type UserProfile = User & {
  tags: string[];
  photos: string[];
  profilePhoto: string;
  fameRating: number;
  location?: Location;
  isOnline: boolean;
  lastSeen: Date | null;
  likedBy: string[];
  viewedBy: string[];
  blocked?: string[];
  reported: boolean;
};
export interface Match {
  id: string;
  users: [string, string];
  createdAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'view' | 'message' | 'match' | 'unlike';
  fromUserId: string;
  read: boolean;
  createdAt: Date;
}
