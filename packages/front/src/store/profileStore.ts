import { create } from 'zustand';
import { UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserImage } from '@/types/user-image';
import { ImagePosition } from '@/types/dto/update-image-position.dto';

type UserProfileState = {
  draft: UpdateUserDto | null;
  birthDateDraft: Date | null;
  photos: UserImage[];
  imagesToDelete: string[];
  imagesPositionToUpdate: ImagePosition[];
  userList: UserProfile[];
  userListFromNotification: UserProfile[];

  updateUserDraft: (userDraft: UpdateUserDto) => void;
  updateUserPhotos: (userPhoto: UserImage[]) => void;
  updateImagesToDelete: (imagePreviewList: string[]) => void;
  updateImagesPositionToUpdate(imageList: ImagePosition[]): void;
  updateUserList(users: UserProfile[]): void;
  updateBirthDateDraft: (date: Date) => void;
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
  birthDateDraft: null,

  updateUserDraft: (userDraft: UpdateUserDto) => {
    set(() => ({ draft: userDraft }));
  },

  updateBirthDateDraft: (date: Date) => {
    set(() => ({ birthDateDraft: date }));
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
}));

