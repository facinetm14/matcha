import { create } from 'zustand';
import { UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserImage } from '@/types/user-image';
import { ImagePosition } from '@/types/dto/update-image-position.dto';
import { userApi } from '@/api/user.api';

type UserProfileState = {
  user: UserProfile | null;
  selectedUser: UserProfile | null;
  draft: UpdateUserDto | null;
  photos: UserImage[];
  imagesToDelete: string[];
  imagesPositionToUpdate: ImagePosition[];
  userList: UserProfile[];
  userListFromNotification: UserProfile[];

  updateUserProfile: (userProfile: UserProfile) => void;
  updateSelectedUserProfile: (userProfile: UserProfile) => void;
  updateUserDraft: (userDraft: UpdateUserDto) => void;
  updateUserPhotos: (userPhoto: UserImage[]) => void;
  updateImagesToDelete: (imagePreviewList: string[]) => void;
  updateImagesPositionToUpdate(imageList: ImagePosition[]): void;
  updateUserList(users: UserProfile[]): void;
  fetchProfile(): void;
  fetchSelectedProfile(userId: string): void;
};

export const useProfileStore = create<UserProfileState>((set) => ({
  user: null,
  selectedUser: null,
  draft: null,
  photos: [],
  imagesToDelete: [],
  imagesPositionToUpdate: [],
  userList: [],
  userListFromNotification: [],

  updateUserProfile: (userProfile: UserProfile) => {
    set(() => ({ user: userProfile, photos: userProfile.photos }));
  },
  updateSelectedUserProfile: (userProfile: UserProfile) => {
    set(() => ({ selectedUser: userProfile }));
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
  updateUserList: (users: UserProfile[]) => {
    set(() => ({ userList: users }));
  },
  updateUserListFromNotification: (users: UserProfile[]) => {
    set(() => ({ userListFromNotification: users }));
  },
  fetchProfile: async () => {
    const res = await userApi.getMe();
    if (!res.ok) {
      return;
    }

    const user = await res.json();

    const userProfile = {
      ...user,
      sexualOrientation: user.sexualOrientation?.split(' ') ?? [],
    };
    set(() => ({ user: userProfile, photos: userProfile.photos }));
  },

  fetchSelectedProfile: async (userId: string) => {
    const res = await userApi.viewUserProfile(userId);
    if (!res.ok) {
      return;
    }

    const user = await res.json();

    const userProfile = {
      ...user,
      sexualOrientation: user.sexualOrientation?.split(' ') ?? [],
    };
    set(() => ({ selectedUser: userProfile }));
  },
}));
