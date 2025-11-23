import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Star, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/api/user.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInitials } from '@/utils/get-initials';
import { logout } from '@/utils/auth';
import { Loadder } from '@/components/ui/Loadder';
import { useGetProfile } from '@/hooks/useGetProfile';
import { QUERY_KEYS } from '@/utils/utils';

export default function Browse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: isPendingConnectedUser,
    error: errorConnectedUser,
    data: connectedUser,
  } = useGetProfile();

  const notificationList = connectedUser?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const {
    isPending,
    data: users,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.BROWSE_USERS],
    queryFn: async () => {
      const res = await userApi.browseUsers();
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const users = await res.json();
      return users;
    },
  });

  const currentUser = users ? users[0] : null;

  const handleLike = () => {
    toast.success(`You liked ${currentUser.firstName}! 💕`);
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.BROWSE_USERS],
      exact: true,
    });
  };

  const handlePass = () => {};

  const viewProfile = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  useEffect(() => {
    if (error || errorConnectedUser) {
      logout(navigate);
    }
  }, [error, errorConnectedUser, navigate]);

  if (isPending || isPendingConnectedUser) {
    return <Loadder />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pt-20">
        <Navigation
          unreadNotifications={unreadNotifications}
          unreadMessages={unreadMessages}
        />
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-muted-foreground">No more profiles to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-8">
        <Card className="relative overflow-hidden shadow-card">
          {/* Profile Image */}
          <div className="relative h-[500px] md:h-[600px]">
            {currentUser.photos.length ? (
              <img
                src={currentUser.photos[0].preview}
                alt={currentUser.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-3xl font-bold text-primary">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Info Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-background/20 backdrop-blur-sm hover:bg-background/30"
              onClick={viewProfile}
            >
              <Info className="w-5 h-5 text-white" />
            </Button>

            {/* Online Status */}
            {currentUser.isOnline && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Online</span>
              </div>
            )}

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {currentUser.firstName}, {currentUser.age}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.location?.city ?? 'PARIS'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">
                    {currentUser.fameRating}
                  </span>
                </div>
              </div>

              <p className="text-sm mb-3 line-clamp-2">{currentUser.bio}</p>

              <div className="flex flex-wrap gap-2">
                {currentUser.tags.slice(0, 5).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-background/20 backdrop-blur-sm text-white border-white/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 p-6 bg-card">
            <Button
              size="icon"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 hover:border-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
              onClick={handlePass}
            >
              <X className="w-19 h-10 text-destructive" />
            </Button>

            {!!connectedUser?.photos.length && (
              <Button
                size="icon"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                onClick={handleLike}
              >
                <Heart className="w-10 h-10 fill-primary text-primary" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
