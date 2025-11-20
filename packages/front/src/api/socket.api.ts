import { IS_LOGGED_IN_KEY } from '@/App';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../../../shared/socket-events';

const serverUrl = import.meta.env.VITE_SERVER_URL || `http://localhost:5000`;

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!localStorage.getItem(IS_LOGGED_IN_KEY)) {
    socket = null;
    return null;
  }

  if (!socket) {
    socket = io(serverUrl, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
    });
  }

  if (!socket.connected) socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  socket?.emit(SocketEvents.DISCONNECT);
  socket = null;
};
