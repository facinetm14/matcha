import { UserProfile } from '@/types/user';
import { create } from 'zustand';

type UserProfileState = {
  user: UserProfile | null;
  updateUserProfile: (userProfile: UserProfile) => void;
};

export const useProfile = create<UserProfileState>((set) => ({
  user: null,
  updateUserProfile: (userProfile: UserProfile) =>
    set(() => ({ user: userProfile })),
}));
