import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MessageCircle, Users, HeartOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useGetProfile } from '@/hooks/useGetProfile';
import { connectSocket } from '@/api/socket.api';
import { userApi } from '@/api/user.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/types/user';
import { Notification } from '@/types/user';
import { getInitials } from '@/utils/get-initials';
import { resolveUserImageUrl } from '@/utils/resolve-user-image-url';
import { Loadder } from '@/components/ui/Loadder';
import { SocketEvents } from '../../../shared/socket-events';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/utils/auth';
import { QUERY_KEYS } from '@/utils/utils';
import { INCOMMING_MESSAGE_TIMEOUT_MS } from '../../../shared/notification-time';

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: isPendingProfile,
    error: errorProfile,
    data: connectedUser,
  } = useGetProfile();

  const notificationList = connectedUser?.notifications ?? [];

  const {
    isPending: isPendingUserList,
    data,
    error: errorUserList,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_USERS_PROFILE_LIST],
    queryFn: async (): Promise<UserProfile[]> => {
      const userIdList = notificationList.map((notif) => notif.fromUser) ?? [];
      if (!userIdList.length) {
        return [];
      }

      const res = await userApi.getUserProfileList(userIdList);
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const userList = await res.json();
      return userList;
    },
  });

  const [filter, setFilter] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-primary fill-primary" />;
      case 'view':
        return <Eye className="w-5 h-5 text-secondary" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-accent" />;
      case 'match':
        return <Users className="w-5 h-5 text-primary" />;
      case 'unlike':
        return <HeartOff className="w-5 h-5 text-destructive" />;
      default:
        return <Heart className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const user = usersList.find((u) => u.id === notification.fromUser);
    const name = user?.firstName || 'Someone';

    switch (notification.category) {
      case 'like':
        return `${name} liked your profile`;
      case 'view':
        return `${name} viewed your profile`;
      case 'message':
        return `${name} sent you a message`;
      case 'match':
        return `You matched with ${name}! 💕`;
      case 'unlike':
        return `${name} unliked your profile`;
    }
  };

  const filteredNotifications = filter
    ? notificationList.filter((n) => n.category === filter)
    : notificationList;

  const handleReadNotification = (notification: Notification) => {
    const socket = connectSocket();
    if (!socket) {
      return;
    }

    // message read will handled in chat that will prevent duplication
    if (!notification.isRead && notification.category !== 'message') {
      socket
        .timeout(INCOMMING_MESSAGE_TIMEOUT_MS)
        .emit(SocketEvents.READING_NOTIFICATION, {
          category: notification.category,
          author: notification.id,
        });
    }

    let redirectUrl = `/profile/${notification.fromUser}`;

    if (notification.category === 'message') {
      const notifId = notification.id;

      //message notification id is : `uuid()-msg-channelId`;
      const room = notifId.slice(notifId.indexOf('msg') + 4);

      const params = new URLSearchParams({
        openRoom: room,
      });

      redirectUrl = `/chat?${params.toString()}`;
    }

    navigate(redirectUrl);
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_USERS_PROFILE_LIST],
      exact: true,
    });
  }, [connectedUser, queryClient]);

  useEffect(() => {
    if (errorUserList || errorProfile) {
      logout(navigate);
    }
  }, [errorProfile, errorUserList, navigate]);

  useEffect(() => {
    if (data) {
      setUsersList(data);
    }
  }, [data]);

  if (isPendingProfile || isPendingUserList) {
    return <Loadder />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-3xl mx-auto px-4 pt-6 md:pt-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        {/* --- Boutons de filtrage --- */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === 'like' ? 'default' : 'outline'}
            onClick={() => setFilter(filter === 'like' ? null : 'like')}
          >
            <Heart className="w-4 h-4 mr-2" /> Likes
          </Button>
          <Button
            variant={filter === 'view' ? 'default' : 'outline'}
            onClick={() => setFilter(filter === 'view' ? null : 'view')}
          >
            <Eye className="w-4 h-4 mr-2" /> Views
          </Button>
          <Button
            variant={filter === 'message' ? 'default' : 'outline'}
            onClick={() => setFilter(filter === 'message' ? null : 'message')}
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Messages
          </Button>
        </div>

        {/* --- Liste des notifications --- */}
        <div className="space-y-3">
          {filteredNotifications
            .sort((a, b) => (a.isRead && !b.isRead ? 1 : -1))
            .map((notification) => {
              const user = usersList.find(
                (u) => u.id === notification.fromUser,
              );

              return (
                <Card
                  key={notification.id}
                  className={`shadow-card transition-all hover:shadow-soft cursor-pointer ${
                    !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => handleReadNotification(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={resolveUserImageUrl(user?.photos[0]?.preview)}
                        />
                        <AvatarFallback>
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationIcon(notification.category)}
                          <p className="font-medium">
                            {getNotificationText(notification)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}
