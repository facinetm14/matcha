import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Eye,
  Settings,
  Heart as HeartIcon,
  MapPin,
  Save,
  Star,
  X as Cancel,
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { UserImage } from '@/types/user-image';
import { getInitials } from '@/utils/get-initials';

type ProfileHeaderCardProps = {
  profile: UserProfile;
  photos: UserImage[];
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenSettings: () => void;
};

export function ProfileHeaderCard({
  profile,
  photos,
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onOpenSettings,
}: ProfileHeaderCardProps) {
  const renderActionButtons = (): ReactNode =>
    !isEditing ? (
      <Button variant="outline" onClick={onEdit}>
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    ) : (
      <>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button variant="destructive" onClick={onCancel}>
          <Cancel className="w-4 h-4" />
          Cancel
        </Button>
      </>
    );

  return (
    <Card className="mb-6 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
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

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}, {profile.age}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {(profile.location?.isEnabledByUser &&
                      profile.location?.city) ??
                      'not defined'}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">
                    Fame Rating: {profile.fameRating}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open settings"
                  onClick={onOpenSettings}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                {renderActionButtons()}
              </div>
            </div>

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
  );
}
