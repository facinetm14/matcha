import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserIdentifier } from '../../../shared/user-identifier';
import { DeleteUserImageDto } from '@/types/dto/delete-image.dto';
import { UpdateImagePositionDto } from '@/types/dto/update-image-position.dto';
import { CreateInteractionDto } from '@/types/dto/create-interaction.dto';

const API_BASE_ROUTE = import.meta.env.VITE_BASE_API;

const getMe = async () => {
  return fetch(`${API_BASE_ROUTE}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
};

const viewUserProfile = async (userId: string) => {
  return fetch(`${API_BASE_ROUTE}/users/${userId}/view`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
};

const viewUserProfileList = async (userIdList: string[]) => {
  return fetch(`${API_BASE_ROUTE}/users/view`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ userIdList }),
    credentials: 'include',
  });
};

const checkUserIdentifierAvailability = async (
  field: UserIdentifier,
  value: string,
) => {
  return fetch(`${API_BASE_ROUTE}/users/check-identifier`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ field, value }),
  });
};

const updateUserProfile = async (updateUserDto: UpdateUserDto) => {
  return fetch(`${API_BASE_ROUTE}/users/update`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      ...updateUserDto,
      sexualOrientation:
        updateUserDto.sexualOrientation?.filter((p) => !!p) ?? [],
    }),
    credentials: 'include',
  });
};

const deleteUserImage = async (deleteImageDto: DeleteUserImageDto) => {
  return fetch(`${API_BASE_ROUTE}/users/images/remove`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(deleteImageDto),
    credentials: 'include',
  });
};

const reorderImages = async (
  updateImagePositionDto: UpdateImagePositionDto,
) => {
  return fetch(`${API_BASE_ROUTE}/users/images/reorder`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(updateImagePositionDto),
    credentials: 'include',
  });
};

const getAllTags = async () => {
  return fetch(`${API_BASE_ROUTE}/users/tags`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
};

const browseUsers = async () => {
  return fetch(`${API_BASE_ROUTE}/users/browse`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    credentials: 'include',
  });
};

const interactWithUser = async (
  createUserInteractionDto: CreateInteractionDto,
) => {
  return fetch(`${API_BASE_ROUTE}/users/interaction`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(createUserInteractionDto),
    credentials: 'include',
  });
};

export const userApi = {
  getMe,
  checkUserIdentifierAvailability,
  updateUserProfile,
  deleteUserImage,
  reorderImages,
  getAllTags,
  browseUsers,
  viewUserProfile,
  interactWithUser,
  viewUserProfileList,
};
