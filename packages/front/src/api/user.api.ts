import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { UserIdentifier } from '../../../shared/user-identifier';
import { DeleteUserImageDto } from '@/types/dto/delete-image.dto';
import { UpdateImagePositionDto } from '@/types/dto/update-image-position.dto';

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

export const userApi = {
  getMe,
  checkUserIdentifierAvailability,
  updateUserProfile,
  deleteUserImage,
  reorderImages,
};
