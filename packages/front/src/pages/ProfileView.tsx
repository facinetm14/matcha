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
  LockKeyholeOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useProfileStore } from '@/store/profileStore';
import { getInitials } from '@/utils/get-initials';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { useEffect } from 'react';
import { CreateInteractionDto } from '@/types/dto/create-interaction.dto';
import Login from './Login';
import { disconnectSocket } from '@/api/socket.api';
import { useGetProfile } from '@/hooks/useGetProfile';
import { Loadder } from '@/components/ui/Loadder';
import { IS_LOGGED_IN_KEY } from '@/App';
import { useAuthStore } from '@/store/authStore';

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPending: isPendingConnectedUser, error: errorProfile } =
    useGetProfile();

  const {
    selectedUser,
    updateSelectedUserProfile,
    user: connectedUser,
  } = useProfileStore((state) => state);

  const { updateLoginStatus } = useAuthStore();

  const notificationList = connectedUser?.notifications ?? [];

  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const {
    isPending,
    data: currentUser,
    error,
    refetch: refetchUserProfile,
  } = useQuery({
    queryKey: ['viewUser'],
    queryFn: async () => {
      const res = await userApi.viewUserProfile(id);
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const user = await res.json();
      return user;
    },
    enabled: !!id,
  });

  const userInteractionMutation = useMutation({
    mutationFn: async ({
      query,
      message,
    }: {
      query: CreateInteractionDto;
      message: string;
    }) => {
      const actionResult = await userApi.interactWithUser(query);
      if (actionResult.status !== 201) {
        throw new Error(`Failed to ${query.category} user. Please try again.`);
      }
      const currentUserResp = await userApi.getMe();
      if (!currentUserResp.ok) {
        throw new Error('Failled to retrieve user infos');
      }
      await refetchUserProfile();
      return message;
    },

    onSuccess: (message: string) => {
      toast.success(`${message}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (currentUser) {
      updateSelectedUserProfile(currentUser);
    }
  }, [updateSelectedUserProfile, currentUser, connectedUser]);

  if (error || errorProfile) {
    localStorage.removeItem(IS_LOGGED_IN_KEY);
    disconnectSocket();
    updateLoginStatus(false);
    return <Login />;
  }

  if (isPending || isPendingConnectedUser) {
    return <Loadder />;
  }

  if (!selectedUser) {
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
    const message = `You liked ${selectedUser.firstName}! 💕`;
    const query: CreateInteractionDto = {
      recipient: selectedUser.id,
      category: 'like',
    };

    userInteractionMutation.mutate({ query, message });
  };

  const hasAlreadyLikedSelectedUser = selectedUser.likedBy.includes(
    connectedUser?.id,
  );

  const hasSelectedAlreadyLiked = connectedUser?.likedBy.includes(
    selectedUser.id,
  );

  const hasMatched = hasAlreadyLikedSelectedUser && hasSelectedAlreadyLiked;

  const hasAlreadyBlocked = (currentUserId: string): boolean => {
    return !selectedUser.likedBy.includes(currentUserId);
  };

  const handleUnlike = () => {
    const message = `You unliked ${selectedUser.firstName}!`;
    const query: CreateInteractionDto = {
      recipient: selectedUser.id,
      category: 'unlike',
    };

    userInteractionMutation.mutate({ query, message });
  };

  const handleUnblock = () => {
    const message = `You unblocked ${selectedUser.firstName}!`;
    const query: CreateInteractionDto = {
      recipient: selectedUser.id,
      category: 'unblock',
    };

    userInteractionMutation.mutate({ query, message });
  };

  const handleReport = () => {
    const message = `${selectedUser.firstName} has been reported.`;
    const query: CreateInteractionDto = {
      recipient: selectedUser.id,
      category: 'report',
    };

    userInteractionMutation.mutate({ query, message });
    navigate('/browse');
  };

  const handleBlock = () => {
    const message = `${selectedUser.firstName} has been blocked.`;
    const query: CreateInteractionDto = {
      recipient: selectedUser.id,
      category: 'block',
    };

    userInteractionMutation.mutate({ query, message });
    navigate('/browse');
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
                {selectedUser.photos.length ? (
                  <img
                    src={selectedUser.photos[0].preview}
                    alt={selectedUser.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-3xl font-bold text-primary">
                    {getInitials(selectedUser.firstName, selectedUser.lastName)}
                  </div>
                )}
                {selectedUser.isOnline && (
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
              {selectedUser.photos.slice(1, 5).map((photo, index) => (
                <Card key={index} className="overflow-hidden shadow-card">
                  <div className="aspect-square">
                    <img
                      src={photo.preview}
                      alt={`${selectedUser.firstName} ${index + 2}`}
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
                      {selectedUser.firstName} {selectedUser.lastName},{' '}
                      {selectedUser.age}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUser.location?.city ?? 'PARIS'}</span>
                    </div>
                    {!selectedUser.isOnline && selectedUser.lastSeen && (
                      <p className="text-sm text-muted-foreground">
                        Active{' '}
                        {formatDistanceToNow(selectedUser.lastSeen, {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-bold text-lg">
                      {selectedUser.fameRating}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Username</h3>
                  <p className="text-muted-foreground">
                    {selectedUser.username}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{selectedUser.bio}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  {hasMatched && (
                    <Badge className="bg-primary/10 text-black px-3 py-1 rounded-full">
                      You matched with {selectedUser.firstName}. You can start
                      chatting! 💕💬
                    </Badge>
                  )}
                  {!hasMatched && hasSelectedAlreadyLiked && (
                    <Badge className="bg-primary/10 text-black px-3 py-1 rounded-full">
                      {selectedUser.firstName} has liked you! Like back to
                      match. 💕
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-semibold capitalize">
                      {selectedUser.gender}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="font-semibold">
                      {selectedUser.viewedBy.length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Likes</p>
                    <p className="font-semibold">
                      {selectedUser.likedBy.length}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!!connectedUser?.photos.length && (
                    <>
                      {hasAlreadyLikedSelectedUser ? (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={handleUnlike}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Unlike
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 hover:bg-primary"
                          onClick={handleLike}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Like
                        </Button>
                      )}
                    </>
                  )}
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
                  {hasAlreadyBlocked(connectedUser?.id) ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={handleBlock}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleUnblock}
                    >
                      <LockKeyholeOpen className="w-4 h-4 mr-2" />
                      Unblock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
