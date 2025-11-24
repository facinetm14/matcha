import { Channel, Message } from '@/types/user';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeMessages(channelList?: Channel[]): Message[] {
  if (!channelList) {
    return [];
  }

  let messageList: Message[] = [];

  for (const ch of channelList) {
    messageList = [...messageList, ...ch.messageList];
  }

  return messageList;
}

export const QUERY_KEYS = {
  ME: 'me',
  BROWSE_USERS: 'browseUsers',
  NOTIFICATIONS: 'notificats',
  VIEW_USER: 'viewUser',
  GET_CHANNELS: 'getchannels',
  GET_USERS_PROFILE_LIST: 'getUserProfileList',
  FILTER_USERS: 'filerUsers',
} as const;
