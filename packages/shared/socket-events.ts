export const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'logout',
  USER_INTERACTION_ADDED: 'user_interaction_added',
  USER_DISCONNECTED: 'user_disconnected',
  USER_CONNECTED: 'user_connected',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  READING_NOTIFICATION: 'read_notification',
  NOTIFICATION_READ: 'notification_read',
} as const;
