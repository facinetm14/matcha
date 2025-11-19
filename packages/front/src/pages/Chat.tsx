import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Circle } from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useProfileStore } from '@/store/profileStore';
import { Loadder } from '@/components/ui/Loadder';
import { Channel } from '../types/user';
import { getInitials } from '@/utils/get-initials';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export default function Chat() {
  const { isPending } = useGetProfile();
  const { user: connectedUser } = useProfileStore();

  const notificationList = connectedUser?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;

  const {
    isPending: isPendingChannelList,
    data: channelList,
    refetch: refetchChanneList,
  } = useQuery({
    queryKey: ['getChannels'],
    queryFn: async (): Promise<Channel[]> => {
      const res = await userApi.getChannels();
      if (!res.ok) {
        throw new Error('Failed to browse users');
      }
      const channelList = (await res.json()) as Channel[];
      return channelList;
    },
    enabled: !!connectedUser,
  });

  const [selectedMatchId, setSelectedMatchId] = useState(
    connectedUser?.matched[0],
  );
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);

  const unreadMessages = messages.filter(
    (m) => !m.isRead && m.senderId !== connectedUser?.id,
  ).length;

  const chatMessages = messages
    .filter((m) => m.matchId === selectedMatchId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const handleSend = () => {
    if (messageText.trim() && selectedMatchId) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        matchId: selectedMatchId,
        senderId: 'current-user',
        content: messageText,
        createdAt: new Date(),
        read: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const selectedMatch = channelList?.find((ch) => ch.id === selectedMatchId);

  useEffect(() => {
    refetchChanneList();
  }, [connectedUser, refetchChanneList]);

  if (isPending || isPendingChannelList) {
    return <Loadder />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-8 h-[calc(100vh-8rem)]">
        <div className="grid md:grid-cols-[320px_1fr] gap-4 h-full">
          {/* Matches List */}
          <Card className="overflow-hidden shadow-card">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Matches</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {channelList?.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors ${
                    selectedMatchId === match.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={match.interlocutor.photos[0]} />
                      <AvatarFallback>
                        {getInitials(
                          match.interlocutor.firstName,
                          match.interlocutor.lastName,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {match.interlocutor.isOnline && (
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold truncate">
                      {match.interlocutor.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {match.messageList.at(-1)?.content ||
                        'Start a conversation'}
                    </p>
                  </div>
                  {match.messageList.at(-1) && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(match.messageList.at(-1)?.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex flex-col shadow-card overflow-hidden">
            {selectedMatch ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedMatch.interlocutor.photos[0]} />
                    <AvatarFallback>
                      {getInitials(
                        selectedMatch.interlocutor.firstName[0],
                        selectedMatch.interlocutor.lastName,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {selectedMatch.interlocutor.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMatch.interlocutor.isOnline
                        ? 'Online'
                        : `Active ${formatDistanceToNow(selectedMatch.interlocutor.lastSeen || new Date(), { addSuffix: true })}`}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === connectedUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.senderId === connectedUser?.id
                            ? 'bg-gradient-romantic text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.senderId === connectedUser?.id ? 'text-white/70' : 'text-muted-foreground'}`}
                        >
                          {formatDistanceToNow(message.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      className="bg-gradient-romantic"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Select a match to start chatting
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
