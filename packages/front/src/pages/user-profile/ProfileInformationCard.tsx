import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TagInput } from '@/components/ui/tag-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MapView from '@/components/ui/map-view';
import { DatePicker } from '@/components/DatePicker';
import { PhotoGallery } from '@/components/PhotoGalery';
import { Gender, Location, UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { getGenderLabel } from '@/utils/get-gender-label';
import { Info, MapPin } from 'lucide-react';

const MAX_BIO_CHARACTERS = 500;

type ProfileInformationCardProps = {
  profile: UserProfile;
  draft: UpdateUserDto | null;
  isEditing: boolean;
  errors: Record<string, string>;
  clearError: (field: string) => void;
  updateUserDraft: (userDraft: UpdateUserDto) => void;
  updateBirthDateDraft: (date: Date) => void;
};

export function ProfileInformationCard({
  profile,
  draft,
  isEditing,
  errors,
  clearError,
  updateUserDraft,
  updateBirthDateDraft,
}: ProfileInformationCardProps) {
  const readOnlyField = (value?: string | null) => (
    <p className="p-2 bg-muted rounded read-only">{value ?? 'not defined'}</p>
  );

  const updateDraftField = (fields: Partial<UpdateUserDto>) => {
    updateUserDraft({
      ...(draft ?? {}),
      ...fields,
    } as UpdateUserDto);
  };

  const renderLocationDisplay = () => (
    <div className="p-2 bg-muted rounded read-only flex items-center gap-2">
      <MapPin className="w-4 h-4" />
      {profile.location?.isEnabledByUser ? (
        <p>{profile.location?.city}</p>
      ) : (
        <p>Location tracking disabled</p>
      )}
    </div>
  );

  const renderLocationSettings = () => (
    <div className="border rounded-md p-3 space-y-4 bg-muted">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <p className="text-sm">{'Location tracking'}</p>
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            Share your approximate location to improve nearby matches. You can
            change this anytime.
          </p>
        </div>

        <Switch
          checked={Boolean(draft?.location?.isEnabledByUser)}
          onCheckedChange={(checked) =>
            updateDraftField({
              location: {
                ...(draft?.location ?? profile.location),
                isEnabledByUser: Boolean(checked),
              } as Location,
            })
          }
        />
      </div>

      {Boolean(draft?.location?.isEnabledByUser) && (
        <MapView
          latitude={draft?.location?.lat}
          longitude={draft?.location?.lng}
          isEditable={isEditing}
          onLocationSelect={(lat, lng, city) =>
            updateDraftField({
              location: {
                ...(draft?.location ?? profile.location ?? {}),
                lat,
                lng,
                city:
                  city ??
                  (draft?.location ?? profile.location)?.city ??
                  undefined,
                isEnabledByUser: (
                  draft?.location ?? profile.location
                )?.isEnabledByUser,
              } as Location,
            })
          }
        />
      )}
    </div>
  );

  const renderSexualOrientationButtons = () => (
    <div className="flex flex-wrap gap-2">
      {(['male', 'female', 'non-binary'] as const).map((preference) => (
        <Button
          key={preference}
          variant={
            draft?.sexualOrientation?.includes(preference) ? 'default' : 'outline'
          }
          onClick={() => {
            const currentPreferences = draft?.sexualOrientation ?? [];
            const newPreferences = currentPreferences.includes(preference)
              ? currentPreferences.filter((pref) => pref !== preference)
              : [...currentPreferences, preference];

            updateDraftField({
              sexualOrientation: newPreferences as UpdateUserDto['sexualOrientation'],
            });
            clearError('sexualOrientation');
          }}
        >
          {getGenderLabel(preference)}
        </Button>
      ))}
    </div>
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            {isEditing ? (
              <>
                <Input
                  value={draft?.firstName ?? ''}
                  onChange={(e) => {
                    updateDraftField({ firstName: e.target.value });
                    clearError('firstName');
                  }}
                  className={errors.firstName ? 'border-destructive' : undefined}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </>
            ) : (
              readOnlyField(profile.firstName)
            )}
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>
            {isEditing ? (
              <>
                <Input
                  value={draft?.lastName ?? ''}
                  onChange={(e) => {
                    updateDraftField({ lastName: e.target.value });
                    clearError('lastName');
                  }}
                  className={errors.lastName ? 'border-destructive' : undefined}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </>
            ) : (
              readOnlyField(profile.lastName)
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Birthday</Label>
            {isEditing ? (
              <>
                <DatePicker
                  defaultDate={profile.birthDate}
                  callBack={(date) => {
                    updateBirthDateDraft(date);
                    clearError('birthDate');
                  }}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate}</p>
                )}
              </>
            ) : (
              readOnlyField(
                profile.birthDate
                  ? new Date(profile.birthDate).toLocaleDateString('fr')
                  : 'not defined',
              )
            )}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            {isEditing ? (
              <>
                <Input
                  type="email"
                  value={draft?.email ?? ''}
                  onChange={(e) => {
                    updateDraftField({ email: e.target.value });
                    clearError('email');
                  }}
                  className={errors.email ? 'border-destructive' : undefined}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </>
            ) : (
              readOnlyField(profile.email)
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>I am</Label>
            {isEditing ? (
              <>
                <Select
                  value={draft?.gender || profile.gender || ''}
                  onValueChange={(value: string) => {
                    updateDraftField({ gender: value as Gender });
                    clearError('gender');
                  }}
                >
                  <SelectTrigger
                    className={errors.gender ? 'border-destructive' : undefined}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender}</p>
                )}
              </>
            ) : (
              <p className="p-2 bg-muted rounded capitalize read-only">
                {profile.gender}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>I'm interested in</Label>
            {isEditing ? (
              <>
                {renderSexualOrientationButtons()}
                {errors.sexualOrientation && (
                  <p className="text-sm text-destructive">
                    {errors.sexualOrientation}
                  </p>
                )}
              </>
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
            <>
              <Textarea
                value={draft?.bio ?? ''}
                onChange={(e) => {
                  const nextBio = e.target.value.slice(0, MAX_BIO_CHARACTERS);
                  updateDraftField({ bio: nextBio });
                  clearError('bio');
                }}
                rows={4}
                maxLength={MAX_BIO_CHARACTERS}
                className={errors.bio ? 'border-destructive' : undefined}
              />
              <div className="text-xs text-muted-foreground text-right">
                {(draft?.bio?.length ?? 0)}/{MAX_BIO_CHARACTERS}
              </div>
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio}</p>
              )}
            </>
          ) : (
            readOnlyField(profile.bio)
          )}
        </div>

        <div className="space-y-2">
          <Label>Interests</Label>
          {isEditing ? (
            <TagInput
              tags={draft?.tags ?? profile.tags ?? []}
              onChange={(tags) =>
                updateDraftField({
                  tags,
                })
              }
              isPossibleToAddTags
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

        <div className="space-y-2">
          <Label className="flex items-center gap-2">I live near...</Label>

          {isEditing ? renderLocationSettings() : renderLocationDisplay()}
        </div>

        <div className="space-y-2">
          <PhotoGallery isEditing={isEditing} />
        </div>
      </CardContent>
    </Card>
  );
}
