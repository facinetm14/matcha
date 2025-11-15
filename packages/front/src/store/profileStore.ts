import { create } from 'zustand';
import { UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserImage } from '@/types/user-image';
import { ImagePosition } from '@/types/dto/update-image-position.dto';

type UserProfileState = {
  user: UserProfile | null;
  draft: UpdateUserDto | null;
  photos: UserImage[];
  imagesToDelete: string[];
  imagesPositionToUpdate: ImagePosition[];

  updateUserProfile: (userProfile: UserProfile) => void;
  updateUserDraft: (userDraft: UpdateUserDto) => void;
  updateUserPhotos: (userPhoto: UserImage[]) => void;
  updateImagesToDelete: (imagePreviewList: string[]) => void;
  updateImagesPositionToUpdate(imageList: ImagePosition[]): void;
};

export const useProfileStore = create<UserProfileState>((set) => ({
  user: null,
  draft: null,
  photos: [],
  imagesToDelete: [],
  imagesPositionToUpdate: [],

  updateUserProfile: (userProfile: UserProfile) => {
    set(() => ({ user: userProfile, photos: userProfile.photos }));
  },
  updateUserDraft: (userDraft: UpdateUserDto) => {
    set(() => ({ draft: userDraft }));
  },

  updateUserPhotos: (userPhoto: UserImage[]) => {
    const sortedUserPhoto = userPhoto.sort((a, b) => a.position - b.position);
    set(() => ({ photos: sortedUserPhoto }));
  },

  updateImagesToDelete: (imagePreviewList: string[]) => {
    set(() => ({ imagesToDelete: imagePreviewList }));
  },

  updateImagesPositionToUpdate: (imageList: ImagePosition[]) => {
    set(() => ({ imagesPositionToUpdate: imageList }));
  },
}));
