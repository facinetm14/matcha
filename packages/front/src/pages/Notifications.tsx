import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MessageCircle, Users, HeartOff } from 'lucide-react';
import { mockNotifications, mockUsers, mockMessages } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const [filter, setFilter] = useState<string | null>(null);

  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;
  const unreadMessages = mockMessages.filter((m) => !m.read).length;

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

  const getNotificationText = (notification: (typeof mockNotifications)[0]) => {
    const user = mockUsers.find((u) => u.id === notification.fromUserId);
    const name = user?.firstName || 'Someone';

    switch (notification.type) {
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
      default:
        return 'New notification';
    }
  };

  // Filtrage
  const filteredNotifications = filter
    ? mockNotifications.filter((n) => n.type === filter)
    : mockNotifications;

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
            variant={filter === 'match' ? 'default' : 'outline'}
            onClick={() => setFilter(filter === 'match' ? null : 'match')}
          >
            <Users className="w-4 h-4 mr-2" /> Matchs
          </Button>
        </div>

        {/* --- Liste des notifications --- */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const user = mockUsers.find(
              (u) => u.id === notification.fromUserId,
            );

            return (
              <Card
                key={notification.id}
                className={`shadow-card transition-all hover:shadow-soft cursor-pointer ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.profilePhoto} />
                      <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
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

                    {!notification.read && (
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