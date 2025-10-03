import { User } from './user.entity';

export type UserProfile = {
  user: User;
  interests: string[];
};
