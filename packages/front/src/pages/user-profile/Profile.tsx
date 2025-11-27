import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { useProfileStore } from '@/store/profileStore';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { Gender, UserProfile, Location } from '@/types/user';
import { DeleteUserImageDto } from '@/types/dto/delete-image.dto';
import { UpdateImagePositionDto } from '@/types/dto/update-image-position.dto';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { disconnectSocket } from '@/api/socket.api';
import { Loadder } from '@/components/ui/Loadder';
import { IS_LOGGED_IN_KEY } from '@/App';
import { logout } from '@/utils/auth';
import { QUERY_KEYS } from '@/utils/utils';
import { ProfileHeaderCard } from '@/pages/user-profile/ProfileHeaderCard';
import { ProfileInformationCard } from '@/pages/user-profile/ProfileInformationCard';

const PHOTOS_KEY = 'photos';
const BIRTH_DATE_KEY = 'birthDate';
import { isValidFirstname } from '../../../../shared/input-validation/is-valid-firstname';
import { isValidLastname } from '../../../../shared/input-validation/is-valid-lastname';
import { isValidEmail } from '../../../../shared/input-validation/is-valid-email';


export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isPending, error, data } = useGetProfile();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    draft,
    photos,
    imagesToDelete,
    imagesPositionToUpdate,
    birthDateDraft,
    updateBirthDateDraft,
    updateUserDraft,
    updateImagesToDelete,
    updateUserPhotos,
    updateImagesPositionToUpdate,
  } = useProfileStore((state) => state);

  const clearError = (field: string) => {
    if (!errors[field]) {
      return;
    }

    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validateDraft = () => {
    const validationErrors: Record<string, string> = {};

    if (!draft || !profile) {
      return validationErrors;
    }

    const validateFirstNameResult = isValidFirstname(draft.firstName);
    if (!validateFirstNameResult.valid) {
      validationErrors.firstName =
        validateFirstNameResult.error || 'First name is invalid';
    }

    const validateLastNameResult = isValidLastname(draft.lastName);
    if (!validateLastNameResult.valid) {
      validationErrors.lastName =
        validateLastNameResult.error || 'Last name is invalid';
    }

    const validateEmailResult = isValidEmail(draft.email);
    if (!validateEmailResult.valid) {
      validationErrors.email = validateEmailResult.error || 'Email is invalid';
    } 

    if (!draft.gender) {
      validationErrors.gender = 'Please select a gender';
    }

    if (!draft.sexualOrientation || draft.sexualOrientation.length === 0) {
      draft.sexualOrientation = ['male', 'female', 'non-binary'];
    }

    if (!birthDateDraft && !profile.birthDate) {
      validationErrors.birthDate = 'Birth date is required';
    }

    return validationErrors;
  };

  const notificationList = profile?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const updateProfileMutation = useMutation({
    mutationFn: async (updateUserDto: UpdateUserDto) => {
      const response = await userApi.updateUserProfile(updateUserDto);
      if (response.status === 200) {
        return true;
      }

      const error = await response.text();
      throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully! 🎉');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME], exact: true });
      updateUserDraft(null);
      updateBirthDateDraft(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteUserImageMutation = useMutation({
    mutationFn: async (deleteImageDto: DeleteUserImageDto) => {
      const response = await userApi.deleteUserImage(deleteImageDto);
      if (response.status === 200) {
        return true;
      }

      const error = await response.text();
      throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME], exact: true });
      updateImagesToDelete([]);
      if (draft) {
        updateUserDraft(null);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateImagePositionsMutation = useMutation({
    mutationFn: async (updateImagePositionDto: UpdateImagePositionDto) => {
      const response = await userApi.reorderImages(updateImagePositionDto);
      if (response.status === 200) {
        return true;
      }

      const error = await response.text();
      throw new Error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME], exact: true });
      updateImagesPositionToUpdate([]);
      if (draft) {
        updateUserDraft(null);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEditStart = () => {
    if (!profile) {
      return;
    }

    updateUserDraft({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender as Gender,
      sexualOrientation: profile.sexualOrientation,
      bio: profile.bio,
      photos: [],
      location: profile.location as Location,
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    if (!draft) {
      return;
    }

    const validationErrors = validateDraft();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      return;
    }

    const toUpdate = {};

    for (const [key, value] of Object.entries(draft)) {
      if (draft[key] !== profile[key]) {
        toUpdate[key] = value;
      }
    }

    if (birthDateDraft) {
      toUpdate[BIRTH_DATE_KEY] = birthDateDraft;
    }

    const updatedKeys = Object.keys(toUpdate);

    const isOnlyEmptyPhotos =
      updatedKeys.length === 1 &&
      updatedKeys[0] === PHOTOS_KEY &&
      toUpdate[PHOTOS_KEY].length === 0;

    if (isOnlyEmptyPhotos && profile.photos.length === 0) {
      toast.info('Set a profile picture to be able to like other profiles!');
    }

    if (updatedKeys.length && !isOnlyEmptyPhotos) {
      updateProfileMutation.mutate(toUpdate);
    }

    if (imagesPositionToUpdate.length) {
      updateImagePositionsMutation.mutate({ images: imagesPositionToUpdate });
    }

    if (imagesToDelete.length) {
      deleteUserImageMutation.mutate({ images: imagesToDelete });
    }

    setIsEditing(false);
    setErrors({});
  };

  useEffect(() => {
    if (data) {
      setProfile(data);
      updateUserPhotos(data.photos);
    }
  }, [data, updateUserPhotos]);

  useEffect(() => {
    const openEdition = searchParams.get('openEdition');
    if (openEdition) {
      setIsEditing(true);
      setErrors({});
      setSearchParams({}, { replace: true });
      toast.info('Complete your profile to get started!');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load profile. Please try again later.');
      localStorage.removeItem(IS_LOGGED_IN_KEY);
      disconnectSocket();
      logout(navigate);
    }
  }, [error, navigate]);

  if (isPending || !profile) {
    return <Loadder />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-8">
        {/* Profile Header */}
        <ProfileHeaderCard
          profile={profile}
          photos={photos}
          isEditing={isEditing}
          isSaving={updateProfileMutation.isPending}
          onEdit={handleEditStart}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />

        <ProfileInformationCard
          profile={profile}
          draft={draft}
          isEditing={isEditing}
          errors={errors}
          clearError={clearError}
          updateUserDraft={updateUserDraft}
          updateBirthDateDraft={updateBirthDateDraft}
        />
      </div>
    </div>
  );
}
