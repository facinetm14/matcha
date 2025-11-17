import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
    });
  }

  if (!socket.connected) socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  socket?.emit('logout');
  socket = null;
};
