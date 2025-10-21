import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Heart,
  X,
  Flag,
  Ban,
  MapPin,
  Star,
  Circle,
} from 'lucide-react';
import { mockUsers, mockNotifications, mockMessages } from '@/utils/mockData';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.id === id);
  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;
  const unreadMessages = mockMessages.filter((m) => !m.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pt-20">
        <Navigation
          unreadNotifications={unreadNotifications}
          unreadMessages={unreadMessages}
        />
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    toast.success(`You liked ${user.firstName}! 💕`);
  };

  const handlePass = () => {
    toast.info('Profile passed');
    navigate('/browse');
  };

  const handleReport = () => {
    toast.success('User reported. We will review this profile.');
  };

  const handleBlock = () => {
    toast.success(`${user.firstName} has been blocked.`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Photos */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-card">
              <div className="relative h-96">
                <img
                  src={user.profilePhoto}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
                {user.isOnline && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/20 backdrop-blur-sm px-3 py-2 rounded-full">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    <span className="text-white text-sm font-medium">
                      Online
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {user.photos.slice(1, 5).map((photo, index) => (
                <Card key={index} className="overflow-hidden shadow-card">
                  <div className="aspect-square">
                    <img
                      src={photo}
                      alt={`${user.firstName} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {user.firstName}, {user.age}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location.city}</span>
                    </div>
                    {!user.isOnline && user.lastSeen && (
                      <p className="text-sm text-muted-foreground">
                        Active{' '}
                        {formatDistanceToNow(user.lastSeen, {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-bold text-lg">{user.fameRating}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{user.biography}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.tags.map((tag, index) => (
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

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-semibold capitalize">{user.gender}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="font-semibold">{user.viewedBy.length}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Likes</p>
                    <p className="font-semibold">{user.likedBy.length}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handlePass}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Pass
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-romantic"
                    onClick={handleLike}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleReport}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={handleBlock}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Block
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
