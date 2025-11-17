import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Edit,
  Save,
  MapPin,
  Star,
  Eye,
  Heart as HeartIcon,
  X as Cancel,
} from 'lucide-react';
import { mockNotifications, mockMessages } from '@/utils/mockData';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import Login from './Login';
import { useProfileStore } from '@/store/profileStore';
import { getInitials } from '@/utils/get-initials';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { Gender } from '@/types/user';
import { TagInput } from '@/components/ui/tag-input';
import { PhotoGallery } from '@/components/PhotoGalery';
import { getGenderLabel } from '@/utils/get-gender-label';
import { DeleteUserImageDto } from '@/types/dto/delete-image.dto';
import { UpdateImagePositionDto } from '@/types/dto/update-image-position.dto';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useSearchParams } from 'react-router-dom';
import { disconnectSocket } from '@/api/socket.api';

export default function Profile() {
  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;
  const unreadMessages = mockMessages.filter((m) => !m.read).length;
  const [searchParams, setSearchParams] = useSearchParams();

  const [isEditing, setIsEditing] = useState(false);

  const {
    draft,
    user: profile,
    photos,
    imagesToDelete,
    imagesPositionToUpdate,
    updateUserDraft,
    updateImagesToDelete,
    updateImagesPositionToUpdate,
  } = useProfileStore((state) => state);

  const { isPending, error, refetch } = useGetProfile();

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
      updateUserDraft(null);
      refetch();
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
      updateImagesToDelete([]);
      if (draft) {
        updateUserDraft(null);
      }
      refetch();
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
      updateImagesPositionToUpdate([]);
      if (draft) {
        updateUserDraft(null);
      }
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    const toUpdate = {};

    for (const [key, value] of Object.entries(draft)) {
      if (draft[key] !== profile[key]) {
        toUpdate[key] = value;
      }
    }

    const updatedKeys = Object.keys(toUpdate);

    const isOnlyEmptyPhotos =
      updatedKeys.length === 1 &&
      updatedKeys[0] === 'photos' &&
      toUpdate['photos'].length === 0;

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
  };

  useEffect(() => {
    const openEdition = searchParams.get('openEdition');
    if (openEdition) {
      updateUserDraft({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender as Gender,
        sexualOrientation: profile.sexualOrientation,
        bio: profile.bio,
        photos: [],
      });
      setIsEditing(true);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    toast.error('Failed to load profile. Please try again later.');
    localStorage.removeItem('isLoggedIn');
    disconnectSocket();
    return <Login />;
  }

  if (isPending || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-8">
        {/* Profile Header */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Photo */}
              <div className="relative mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  {photos.length ? (
                    <img
                      src={photos[0].preview}
                      alt={profile.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-3xl font-bold text-primary">
                      {getInitials(profile.firstName, profile.lastName)}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {profile.firstName} {profile.lastName}, {profile.age}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location?.city ?? 'not defined'}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold">
                        Fame Rating: {profile.fameRating}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0 justify-center">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            updateUserDraft({
                              email: profile.email,
                              firstName: profile.firstName,
                              lastName: profile.lastName,
                              gender: profile.gender as Gender,
                              sexualOrientation: profile.sexualOrientation,
                              bio: profile.bio,
                              photos: [],
                            });
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setIsEditing(false)}
                        >
                          <Cancel className="w-4 h-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Views</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {` ${profile.viewedBy.length} `}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary">
                      {` ${profile.likedBy.length} `}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    value={draft?.firstName ?? ''}
                    onChange={(e) =>
                      updateUserDraft({
                        ...(draft ?? {}),
                        firstName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="p-2 bg-muted rounded read-only">
                    {profile.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    value={draft?.lastName ?? ''}
                    onChange={(e) =>
                      updateUserDraft({
                        ...(draft ?? {}),
                        lastName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="p-2 bg-muted rounded read-only">
                    {profile.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={draft?.email ?? ''}
                  onChange={(e) =>
                    updateUserDraft({
                      ...(draft ?? {}),
                      email: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="p-2 bg-muted rounded read-only">
                  {profile.email}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>I am</Label>
                {isEditing ? (
                  <Select
                    value={draft?.gender || profile.gender || ''}
                    onValueChange={(value: string) =>
                      updateUserDraft({
                        ...(draft ?? {}),
                        gender: value as Gender,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-2 bg-muted rounded capitalize read-only">
                    {profile.gender}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>I'm interested in</Label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {(['male', 'female', 'non-binary'] as const).map(
                      (preference) => (
                        <Button
                          key={preference}
                          variant={
                            draft?.sexualOrientation?.includes(preference)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => {
                            const currentPreferences =
                              draft?.sexualOrientation ?? [];
                            const newPreferences = currentPreferences.includes(
                              preference,
                            )
                              ? currentPreferences.filter(
                                  (pref) => pref !== preference,
                                )
                              : [...currentPreferences, preference];

                            updateUserDraft({
                              ...draft,
                              sexualOrientation: newPreferences,
                            });
                          }}
                        >
                          {getGenderLabel(preference)}
                        </Button>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.sexualOrientation
                      .filter((pre) => pre)
                      .map((preference) => (
                        <Button key={preference} className="cursor-not-allowed">
                          {getGenderLabel(preference)}
                        </Button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Biography</Label>
              {isEditing ? (
                <Textarea
                  value={draft?.bio ?? ''}
                  onChange={(e) =>
                    updateUserDraft({
                      ...(draft ?? {}),
                      bio: e.target.value,
                    })
                  }
                  rows={4}
                />
              ) : (
                <p className="p-2 bg-muted rounded read-only">{profile.bio}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              {isEditing ? (
                <TagInput
                  tags={draft?.tags ?? profile.tags ?? []}
                  onChange={(tags) =>
                    updateUserDraft({
                      ...draft,
                      tags: tags,
                    })
                  }
                />
              ) : (
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded">
                  {profile.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="space-y-2">
              <PhotoGallery isEditing={isEditing} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
