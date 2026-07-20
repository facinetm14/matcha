export interface MessageModel {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  is_read: string | null;
  created_at: Date;
  updated_at: Date;
}
