import { UserImage } from './user-image';

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

export type Location = {
  city: string;
  lat: number;
  lng: number;
};

export interface Match {
  id: string;
  users: [string, string];
  createdAt: Date;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  category: 'like' | 'view' | 'message' | 'match' | 'unlike';
  fromUser: string;
  isRead: boolean;
  createdAt: Date;
}

export type UserProfile = User & {
  tags: string[];
  photos: string[];
  fameRating: number;
  location?: Location;
  isOnline: boolean;
  lastSeen: Date | null;
  likedBy: string[];
  viewedBy: string[];
  blocked?: string[];
  reported: boolean;
  notifications: Notification[];
  matched: string[];
};

export type Channel = {
  id: string;
  interlocutor: UserProfile;
  messageList: Message[];
  createdAt: Date;
  updatedAt: Date;
};
