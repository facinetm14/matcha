export interface NotificationModel {
  id: string;
  author: string;
  from_user: string;
  category: string;
  is_read: string | null;
  created_at: Date;
  updated_at: Date;
}
