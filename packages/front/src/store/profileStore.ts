import { create } from 'zustand';
import { UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';

type UserProfileState = {
  user: UserProfile | null;
  draft: UpdateUserDto | null;
  updateUserProfile: (userProfile: UserProfile) => void;
  updateUserDraft: (userDraft: UpdateUserDto) => void;
};

export const useProfileStore = create<UserProfileState>((set) => ({
  user: null,
  draft: null,

  updateUserProfile: (userProfile: UserProfile) => {
    set(() => ({ user: userProfile }));
  },
  updateUserDraft: (userDraft: UpdateUserDto) => {
    set(() => ({ draft: userDraft }));
  },
}));
