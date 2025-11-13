import { create } from 'zustand';
import { UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserImage } from '@/types/user-image';

type UserProfileState = {
  user: UserProfile | null;
  draft: UpdateUserDto | null;
  photos: UserImage[];

  updateUserProfile: (userProfile: UserProfile) => void;
  updateUserDraft: (userDraft: UpdateUserDto) => void;
  updateUserPhotos: (userPhoto: UserImage[]) => void;
};

export const useProfileStore = create<UserProfileState>((set) => ({
  user: null,
  draft: null,
  photos: [],

  updateUserProfile: (userProfile: UserProfile) => {
    set(() => ({ user: userProfile, photos: userProfile.photos }));
  },
  updateUserDraft: (userDraft: UpdateUserDto) => {
    set(() => ({ draft: userDraft }));
  },

  updateUserPhotos: (userPhoto: UserImage[]) => {
    set(() => ({ photos: userPhoto }));
  },
}));
