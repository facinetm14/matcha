export interface UserInterestModel {
  id: string;
  user_id: string | null;
  interest: string;
  created_at: Date;
  updated_at: Date; 
}