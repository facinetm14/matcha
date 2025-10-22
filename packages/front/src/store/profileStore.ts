import { create } from 'zustand';
import { UserProfile } from '@/types/user';

type UserProfileState = {
  user: UserProfile | null;
  updateUserProfile: (userProfile: UserProfile) => void;
};

export const useProfileStore = create<UserProfileState>((set) => ({
  user: null,
  updateUserProfile: (userProfile: UserProfile) =>
    set(() => ({ user: userProfile })),
}));
