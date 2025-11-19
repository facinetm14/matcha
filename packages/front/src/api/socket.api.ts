import { IS_LOGGED_IN_KEY } from '@/App';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../../../shared/socket-events';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket && localStorage.getItem(IS_LOGGED_IN_KEY)) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
    });
  }

  if (!socket.connected) socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  socket?.emit(SocketEvents.DISCONNECT);
  socket = null;
};
