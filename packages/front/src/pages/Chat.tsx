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
import { Channel, Message } from '../types/user';
import { getInitials } from '@/utils/get-initials';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { connectSocket, disconnectSocket } from '@/api/socket.api';
import { CreateMessageDto } from '@/types/dto/create-message.dto';
import { SocketEvents } from '../../../shared/socket-events';
import { uuid } from '../../../shared/uuid';
import { computeMessages } from '@/utils/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '@/utils/auth';

export default function Chat() {
  const navigate = useNavigate();
  const { isPending, error } = useGetProfile();
  const { user: connectedUser } = useProfileStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const notificationList = connectedUser?.notifications ?? [];
  const unreadNotifications = notificationList.filter((n) => !n.isRead).length;
  const unreadMessages = notificationList.filter(
    (n) => n.category == 'message' && !n.isRead,
  ).length;

  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState([]);

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
      const messageList = computeMessages(channelList);

      setMessages(messageList);
      return channelList;
    },
    enabled: !!connectedUser,
  });

  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const chatMessages = messages
    ?.filter((m) => m.channelId === selectedMatchId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const handleSend = () => {
    const socket = connectSocket();

    if (messageText.trim() && selectedMatchId) {
      const newMessage: CreateMessageDto = {
        channelId: selectedMatchId,
        senderId: connectedUser.id,
        content: messageText,
      };

      if (socket) {
        socket.emit(SocketEvents.SEND_MESSAGE, newMessage);
      }

      const now = new Date();
      const id = uuid();
      setMessages([
        ...messages,
        { ...newMessage, id, createdAt: now, isRead: false },
      ]);
      setMessageText('');
    }
  };

  const selectedMatch = channelList?.find((ch) => ch.id === selectedMatchId);

  const handleSelectChannel = (channelId: string) => {
    const channel = channelList?.find((ch) => ch.id === channelId);
    if (!channel) {
      setSelectedMatchId(channelId);
      return;
    }

    const unreadMessageNotification = notificationList.find(
      (notif) =>
        notif.fromUser === channel.interlocutor.id &&
        notif.category === 'message' &&
        !notif.isRead,
    );

    if (!unreadMessageNotification) {
      setSelectedMatchId(channelId);
      return;
    }

    const socket = connectSocket();
    if (!socket) {
      setSelectedMatchId(channelId);
      return;
    }

    socket.emit(SocketEvents.READING_NOTIFICATION, {
      category: 'message',
      author: channel.interlocutor.id,
    });

    setSelectedMatchId(channelId);
  };

  useEffect(() => {
    const openRoom = searchParams.get('openRoom');
    if (openRoom) {
      handleSelectChannel(openRoom);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refetchChanneList();

    if (error) {
      disconnectSocket();
      logout(navigate);
    }
  }, [connectedUser, refetchChanneList, error, navigate]);

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
                  onClick={() => handleSelectChannel(match.id)}
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
                      {formatDistanceToNow(
                        match.messageList.at(-1)?.createdAt,
                        {
                          addSuffix: true,
                        },
                      )}
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
                  {chatMessages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === connectedUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.senderId === connectedUser?.id
                            ? 'bg-primary/10'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 text-muted-foreground'}`}>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1"
                      maxLength={100}
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
