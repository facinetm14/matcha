import { UserRegisteredPayload } from "../../domain/dto/user-registered-payload";

export interface NotificationService {
  sendUserRegisteredNotifification(payload: UserRegisteredPayload): Promise<void>;
}