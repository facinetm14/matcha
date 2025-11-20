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
