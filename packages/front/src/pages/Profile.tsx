import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LogOut,
  Edit,
  Save,
  MapPin,
  Star,
  Eye,
  Heart as HeartIcon,
  Camera,
} from 'lucide-react';
import {
  mockCurrentUser,
  mockNotifications,
  mockMessages,
} from '@/utils/mockData';
import { toast } from 'sonner';
import { logout } from '@/utils/auth';
import { Gender, UserProfile } from '@/types/user';
import { UpdateUserDto } from '@/types/dto/update-user.dto';
import { useMutation } from '@tanstack/react-query';
import { userProfileApi } from '@/api/user.api';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockCurrentUser);
  const [draft, setDraft] = useState<UpdateUserDto | null>(null);
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  const unreadMessages = mockMessages.filter(m => !m.read).length;

  const updateProfileMutation = useMutation({
    mutationFn: async (updateUserDto: UpdateUserDto) => {
      const response = await userProfileApi.updateUserProfile(updateUserDto);
      if (response.status === 200) {
        return true;
      }
      throw new Error('Failed to update profile. Please try again.');
    },
    onSuccess: () => {
      toast.success('Profile updated successfully! 🎉');
      setProfile((prev) => ({ ...prev, ...draft } as UserProfile));
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    if (!draft) return;
    updateProfileMutation.mutate(draft);
  };

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
                  <img
                    src={profile.profilePhoto}
                    alt={profile.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full shadow-soft"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
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
                      <span>{profile.location.city}</span>
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
                        <Button variant="outline" onClick={() => {
                          setDraft({
                            email: profile.email,
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            gender: profile.gender as Gender,
                            sexualPreferences: profile.sexualPreferences,
                            biography: profile.biography,
                            photos: profile.photos,
                            profilePhoto: profile.profilePhoto,
                          });
                          setIsEditing(true);
                          }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => logout(navigate)}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-romantic"
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
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
                    <p className="text-2xl font-bold text-primary">127</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary">43</p>
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
                  onChange={(e) => setDraft((d) => ({...(d ?? {}), firstName: e.target.value}))} />
                ) : (
                  <p className="p-2 bg-muted rounded">{profile.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                  value={draft?.lastName ?? ''}
                  onChange={(e) => setDraft((d) => ({...(d ?? {}), lastName: e.target.value}))} />
                ) : (
                  <p className="p-2 bg-muted rounded">{profile.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              {isEditing ? (
                <Input type="email" value={draft.email} onChange={(e) => setDraft((d) => ({...(d ?? {}), email: e.target.value}))} />
              ) : (
                <p className="p-2 bg-muted rounded">{profile.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>I am</Label>
                {isEditing ? (
                  <Select value={draft?.gender ?? ''} onValueChange={(value: string) => setDraft({...draft, gender: value as Gender})}>
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
                  <p className="p-2 bg-muted rounded capitalize">
                    {profile.gender}
                  </p>
                )}
            </div>
                  
            <div className="space-y-2">
                <Label>I'm interested in</Label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                  {(['male', 'female', 'non-binary'] as const).map((preference) => (
                    <Button
                    key={preference}
                    variant={draft.sexualPreferences?.includes(preference) ? "default" : "outline"}
                    onClick={() => {
                      const currentPreferences = draft?.sexualPreferences ?? [];
                      const newPreferences = currentPreferences.includes(preference)
                      ? currentPreferences.filter(pref => pref !== preference)
                      : [...currentPreferences, preference];
                      
                      setDraft({ ...draft, sexualPreferences: newPreferences });
                    }}
                    >
                    {preference === 'male' ? 'Male' : preference === 'female' ? 'Female' : 'Non-binary'}
                    </Button>
                  ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                  {(['male', 'female', 'non-binary'] as const).map((preference) => (
                    <Button
                    key={preference}
                    variant={profile.sexualPreferences?.includes(preference) ? "default" : "outline"}
                    >
                    {preference === 'male' ? 'Male' : preference === 'female' ? 'Female' : 'Non-binary'}
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
                  value={draft?.biography ?? ''} 
                  onChange={(e) => setDraft((d) => ({...(d ?? {}), biography: e.target.value}))}
                  rows={4}
                />
              ) : (
                <p className="p-2 bg-muted rounded">{profile.biography}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 p-2 bg-muted rounded">
                {profile.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gradient-romantic text-white"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="space-y-2">
              <Label>Photo Gallery</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {isEditing && draft.photos.length < 5 && (
                  <button className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
