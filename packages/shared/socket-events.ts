export const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'logout',
  USER_IMAGE_UPLOADED: 'user_image_uploaded',
  USER_INTERACTION_ADDED: 'user_interaction_added',
  USER_DISCONNECTED: 'user_disconnected',
  USER_CONNECTED: 'user_connected',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
} as const;