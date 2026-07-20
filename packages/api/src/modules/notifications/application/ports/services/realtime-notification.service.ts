export interface RealtimeNotificationService {
  emitToUser(userId: string, event: string, payload: unknown): void;
}
