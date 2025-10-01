import { ResetPasswordWishedPayload } from "@/core/domain/dto/reset-password-wished-payload";
import { UserRegisteredPayload } from "../../domain/dto/user-registered-payload";

export interface NotificationService {
  sendUserRegisteredNotifification(payload: UserRegisteredPayload): Promise<void>;
  sendResetPasswordNotification(payload: ResetPasswordWishedPayload): Promise<void>;
}